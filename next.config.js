const path = require('path')

module.exports = {
    env: {
        REST_API_URL: 'http://localhost:3600'
    },
    sassOptions: {
        includePaths: ['./public'],
        prependData: `@import "/public/css/_config.scss";`,
    },
}