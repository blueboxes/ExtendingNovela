import React, { useEffect,useRef, useState  } from "react";
import { useStaticQuery, graphql,Link } from "gatsby"
import styled from "@emotion/styled";
import mediaqueries from "@narative/gatsby-theme-novela/src/styles/media";
import throttle from "lodash/throttle";

export interface IToC {
  title:string
}
  
const TableOfContents: React.FC<IToC> = (title) => {
  
  const toCRef = useRef<HTMLDivElement>(null);
  const [show,setShow] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const el = toCRef.current;

      if(!el)
        return;

      const elBox = el.getBoundingClientRect()
      const top = elBox ? elBox.top : 0;
      const height = el.offsetHeight;
      const windowHeight =  window.innerHeight || document.documentElement.clientHeight;
  
      setShow(top + window.scrollY > imageOffsetFromTopOfWindow);
    });
 
    const imageRect = document
      .getElementById("ArticleImage__Hero")
      .getBoundingClientRect();

    const imageOffsetFromTopOfWindow = imageRect.top + window.scrollY;
    setShow(false);

    //based on https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/
    const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            if (entry.intersectionRatio > 0) {
              document.querySelector(`nav ol li a[href*="#${id}"]`).classList.add('active');
            } else {
              document.querySelector(`nav ol li a[href*="#${id}"]`).classList.remove('active');
            }
          });
    });
  
    document.querySelectorAll('h2[id]').forEach((section) => {
      observer.observe(section);
    });
     
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  },20);

  const data = useStaticQuery(graphql`
  query Toc {
    allMdx {
      edges {
        node{
         tableOfContents
          frontmatter {
              title
            }
        }
      }
    }
  }
  `)

  const queryData =  data.allMdx.edges.find(a=>a.node.frontmatter.title === title.article);
  let tocData = {}[0];

  if(queryData && queryData.node.tableOfContents && queryData.node.tableOfContents.items && queryData.node.tableOfContents.items.length >= 2)
  {
    tocData = queryData.node.tableOfContents.items;
  }else{
    return null;
  }

  return (
    <ToCContainer ref={toCRef} show={show}>
      <h6>On this page</h6>
      <TocList>
        {
         tocData.map(heading=>{
            return <li key={heading.url}><Link to={heading.url} activeClassName="">{heading.title}</Link></li>
          })
        } 
      </TocList>
    </ToCContainer>
  );
};

const ToCContainer = styled.nav<{
  show: boolean;
}>`
  outline: none;
  font-size:0.85em;
  padding-left:30px;
  padding-right:30px;
  height: calc(88vh - 40px);
  max-height: 425px;
  
  a, a:visited{
    color: #ccc;
  }

  a.active{
    color: ${p => p.theme.colors.accent};
    border-left: 3px solid ${p => p.theme.colors.accent};
    padding: 5px;
    margin: -5px;
  }

  a:hover{
    color: ${p => p.theme.colors.accent}
  }
  
  opacity: ${p => (p.show ? 1 : 0)};
  visibility: ${p => (p.show ? "visible" : "hidden")};
  transition: ${p =>
    p.show
      ? "opacity 0.1s linear, visibility 0.1s linear"
      : "opacity 0.1s linear, visibility 0.1s linear"};
   
  ${mediaqueries.desktop_medium`
      display: none;
  `}
 
`;
 
const TocList = styled.ol`
  list-style:none;
  padding-top:10px;

  li{
    padding-top:5px;
  }
 
  }
`;


export default TableOfContents;
