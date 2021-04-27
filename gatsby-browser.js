
//to fix bug in gatsby-react-router-scroll
export const onRouteUpdate = ({ location, prevLocation }) => {
  if(location.hash.length > 0 ){
    var targets = document.querySelectorAll(location.hash);

    if(targets && targets[0])
    {
      targets[0].scrollIntoView({
        behavior: 'instant'
      });
    }

  }
}