/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    API_HOST: 'http://localhost:8000',
    ORIGIN: 'http://localhost:3000'
  },
//   sassOptions: {
//     includePaths: [path.join(__dirname, './src/styles')],
//     prependData: `@import "./materialoverrides.scss";`,
// },
}
