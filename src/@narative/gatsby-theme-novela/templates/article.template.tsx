import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import throttle from "lodash/throttle";
import { graphql, useStaticQuery } from "gatsby";

import Share from "@narative/gatsby-theme-novela/src/components/Share";

import Layout from "@narative/gatsby-theme-novela/src/components/Layout";
import MDXRenderer from "@narative/gatsby-theme-novela/src/components/MDX";
import Progress from "@narative/gatsby-theme-novela/src/components/Progress";
import TableOfContents from "@narative/gatsby-theme-novela/src/components/TableOfContents";
import Section from "@narative/gatsby-theme-novela/src/components/Section";
import Subscription from "@narative/gatsby-theme-novela/src/components/Subscription";

import mediaqueries from "@narative/gatsby-theme-novela/src/styles/media";
import { debounce } from "@narative/gatsby-theme-novela/src/utils";

import ArticleAside from "@narative/gatsby-theme-novela/src/sections/article/Article.Aside";
import ArticleHero from "@narative/gatsby-theme-novela/src/sections/article/Article.Hero";
import ArticleControls from "@narative/gatsby-theme-novela/src/sections/article/Article.Controls";
import ArticlesNext from "@narative/gatsby-theme-novela/src/sections/article/Article.Next";
import ArticleSEO from "@narative/gatsby-theme-novela/src/sections/article/Article.SEO";
import ArticleShare from "@narative/gatsby-theme-novela/src/sections/article/Article.Share";
import ArticleFooter from '@narative/gatsby-theme-novela/src/templates/article.footer.template';

import { Template } from "@types";
 
const siteQuery = graphql`
  {
    allSite {
      edges {
        node {
          siteMetadata {
            name,
            siteUrl
          }
        }
      }
    }
  }
`;

const Article: Template = ({ pageContext, location }) => {
  const contentSectionRef = useRef<HTMLElement>(null);

  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const results = useStaticQuery(siteQuery);
  const name = results.allSite.edges[0].node.siteMetadata.name;
  const siteUrl = results.allSite.edges[0].node.siteMetadata.siteUrl;

  const { article, authors, next } = pageContext;

  useEffect(() => {
    const calculateBodySize = throttle(() => {
      const contentSection = contentSectionRef.current;

      if (!contentSection) return;

      /**
       * If we haven't checked the content's height before,
       * we want to add listeners to the content area's
       * imagery to recheck when it's loaded
       */
      if (!hasCalculated) {
        const debouncedCalculation = debounce(calculateBodySize);
        const $imgs = contentSection.querySelectorAll("img");

        $imgs.forEach($img => {
          // If the image hasn't finished loading then add a listener
          if (!$img.complete) $img.onload = debouncedCalculation;
        });

        // Prevent rerun of the listener attachment
        setHasCalculated(true);
      }

      // Set the height and offset of the content area
      setContentHeight(contentSection.getBoundingClientRect().height);
    }, 20);

    calculateBodySize();
    window.addEventListener("resize", calculateBodySize);

    return () => window.removeEventListener("resize", calculateBodySize);
  }, []);

  return (
    <Layout>
      <ArticleSEO article={article} authors={authors} location={location} />
      <ArticleHero article={article} authors={authors} />
      <ArticleAside contentHeight={contentHeight} >
        <TableOfContents article={article.title}/>
      </ArticleAside>
      <ArticleAside contentHeight={contentHeight}>
        <Progress contentHeight={contentHeight} />
      </ArticleAside>
      
      <HeadingShare>
        <Share article={article} siteUrl={siteUrl} showSmall={true} />
      </HeadingShare>
      <ArticleBody ref={contentSectionRef}>
          <MDXRenderer content={article.body}>
          <ArticleShare />
        </MDXRenderer>
      </ArticleBody>
      <FooterShare>
        <p>If you enjoyed reading please share...</p>
        <Share article={article} siteUrl={siteUrl} showSmall={false}/>
      </FooterShare>
      <ArticleFooter pageContext={pageContext} />
      {next.length > 0 && (
        <NextArticle narrow>
          <FooterNext>More articles from {name}</FooterNext>
          <ArticlesNext articles={next} />
          <FooterSpacer />
        </NextArticle>
      )}
    </Layout>
  );
};

export default Article;

const FooterShare = styled.div`
  padding-bottom: 40px;
  text-align: center;
  font-size:12px;
  p{
    padding-bottom:10px;
  }
`;

const HeadingShare = styled.div`
  padding-top: 60px;
  text-align: center;
  font-size:12px;

`;



const MobileControls = styled.div`
  position: relative;
  padding-top: 60px;
  transition: background 0.2s linear;
  text-align: center;

  ${mediaqueries.tablet_up`
    display: none;
  `}
`;

const ArticleBody = styled.article`
  position: relative;
  padding: 80px 0 35px;
  padding-left: 68px;
  transition: background 0.2s linear;

  code{
    font-family: monospace;
    background-color: #f4f0f0;
    padding: 2px 5px;
    border-radius: 5px;
    font-size: 0.9em;
  }

  ${mediaqueries.desktop`
    padding-left: 53px;
  `}
  
  ${mediaqueries.tablet`
    padding: 70px 0 80px;
  `}

  ${mediaqueries.phablet`
    padding: 60px 0;
  `}
`;

const NextArticle = styled(Section)` 
  display: block;
`;

const FooterNext = styled.h3`
  position: relative;
  opacity: 0.25;
  margin-bottom: 100px;
  font-weight: 400;
  color: ${p => p.theme.colors.primary};

  ${mediaqueries.tablet`
    margin-bottom: 60px;
  `}

  &::after {
    content: '';
    position: absolute;
    background: ${p => p.theme.colors.grey};
    width: ${(910 / 1140) * 100}%;
    height: 1px;
    right: 0;
    top: 11px;

    ${mediaqueries.tablet`
      width: ${(600 / 1140) * 100}%;
    `}

    ${mediaqueries.phablet`
      width: ${(400 / 1140) * 100}%;
    `}

    ${mediaqueries.phone`
      width: 90px
    `}
  }
`;

const FooterSpacer = styled.div`
  margin-bottom: 65px;
`;
