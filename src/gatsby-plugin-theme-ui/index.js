import novelaTheme from '@narative/gatsby-theme-novela/src/gatsby-plugin-theme-ui';

export default {
  ...novelaTheme,
  colors: {
    ...novelaTheme.colors,
    primary: '#373737',
    secondary: '#73737D',
    accent: '#0178bd',
    grey: '#73737D',
    background: '#fff',
  },
  fonts: {
    body: '"Source Sans Pro", "Microsoft Yahei", sans-serif,"Charlie Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    heading: 'BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol", "Avenir Next", sans-serif',
  },
};
