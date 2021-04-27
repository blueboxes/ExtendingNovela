import styled from "@emotion/styled";
import { IArticle } from '@types';
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon
} from "react-share";

export interface IShare {
  article: IArticle
  siteUrl: string
  showSmall: boolean
}
 
const Share: React.FC<IShare> = (prams) => {
  
  const { slug, title } = prams.article;
  const url = prams.siteUrl + slug + "/";
  const twitterHandle = ""
  const size = 40

  return (
    <ShareContainer> 
          <TwitterShareButton url={url} title={title} via={twitterHandle} >
                <TwitterIcon  size={size} round={true}  />
          </TwitterShareButton>

          <LinkedinShareButton url={url} >
            <LinkedinIcon  size={size} round={true}/>
          </LinkedinShareButton>

          <RedditShareButton url={url} title={title} >
            <RedditIcon  size={size} round={true} />
          </RedditShareButton>

          <FacebookShareButton url={url}  >
                <FacebookIcon  size={size} round={true}/>
          </FacebookShareButton>

          <WhatsappShareButton url={url} title={title}>
               <WhatsappIcon  size={size} round={true}/>
           </WhatsappShareButton>
    </ShareContainer>
  );
};

const ShareContainer = styled.section<{
}>`
  text-align:center;
  
  button{
    margin:5px;
  }
 
`;
  
export default Share;