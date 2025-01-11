const config = {
    logo: <strong>Kouah AI Documentation</strong>,
    // project: {
    //     link: 'https://github.com/shuding/nextra'
    // },
    head: (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content="Kouah AI" />
            <meta property="og:description" content="The Ultimate chatbot generator" />
            <title>Welcome to Kouah AI </title>
        </>
    ),
    footer: {
        text: (

            <span>
                <a href="https://kouah-ai-pro.vercel.app" target="_blank">
                    Kouah Ai
                </a> {new Date().getFullYear()} ©{' '}
                .
            </span>

        )
    },
    editLink: {
        component: null,
    },
    feedback: {
        content: null,
    },
    banner: {
        key: 'kouahai-release',
        text: (
            <a href="https://kouah-ai-pro.vercel.app" target="_blank">
                🎉 Kouah Ai is released. Read more →
            </a>
        )
    },
    sidebar: {
        toggleButton: true, 
    }
}


export default config
