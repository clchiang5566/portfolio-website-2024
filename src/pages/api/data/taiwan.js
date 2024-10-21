const Contents = {
    title: 'Taiwan \nStreet \nAnother \nWorld',
    subtitle: '#WEBSITE #WEBVR #GAME',
    color: '#aaf683',
    index: 0,
    image: {
        href: '/images/img6.jpg',
    },
    footerTexture: '/texture/nomarl/Material_body_lightgreen.png',
    content: [
        {
            type: 'info',
            headline: 'Info',
            content: [
                {
                    label: 'Year:',
                    value: '2023',
                },
                {
                    label: 'Type:',
                    value: 'Website',
                },
            ],
        },
        {
            type: 'title',
            text: 'Introduction',
        },
        {
            type: 'title',
            text: 'Excution',
        },
        {
            type: 'images',
            images: [
                {
                    image: {
                        url: '/images/taiwan/1.jpg',
                        alt: '',
                    },
                },
                {
                    image: {
                        url: '/images/taiwan/2.jpg',
                        alt: '',
                    },
                },
            ],
        },
    ],
};

export default Contents;
