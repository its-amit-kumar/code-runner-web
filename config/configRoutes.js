const ROUTES = [
    {
        url:'/submitCode',
        auth:false,
        creditCheck:false,
        rateLimit: {
            windowMs:60*1000,
            max:15
        },
        proxy: {
            target:'/submitCode',
            changeOrigin: false,
        }
    },
    {
        url:'/getSubmission',
        auth:false,
        creditCheck:false,
        rateLimit: {
            windowMs:60*1000,
            max:60
        },
        proxy: {
            target:'/getSubmission',
            changeOrigin: false,
        }
    },
    {
        url:'/user/register',
        auth:false,
        creditCheck:false,
        rateLimit: {
            windowMs:60*1000,
            max:5
        },
        proxy: {
            target:'/user/register',
            changeOrigin: false,
        }
    },
    {
        url:'/user/login',
        auth:false,
        creditCheck:false,
        rateLimit: {
            windowMs:60*1000,
            max:5
        },
        proxy: {
            target:'/user/login',
            changeOrigin: false,
        }
    }

]

exports.ROUTES = ROUTES