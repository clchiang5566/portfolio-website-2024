const Contents = {
    title: 'Maxis \nMaze \nGame',
    subtitle: '#INTERACTION #DEVICE #GAME',
    color: '#aaf683',
    index: 3,
    image: {
        href: '/images/img12.jpg',
    },
    footerTexture: '/texture/nomarl/Material_body_lightgreen.png',
    content: [
        {
            type: 'info',
            headline: 'Info',
            content: [
                {
                    label: 'Year:',
                    value: '2019',
                },
                {
                    label: 'Client:',
                    value: 'Maxis Malaysia',
                },
                {
                    label: 'Agent:',
                    value: 'Fitch',
                },
                {
                    label: 'Type:',
                    value: 'Device',
                },
            ],
        },
        {
            type: 'text',
            text:
                'Maxis is a major telecommunications company in Malaysia, offering a variety of services including mobile phones, data plans, and fiber-optic networks. It is one of the leading communication service providers in Malaysia, with a large user base.',
        },
        {
            type: 'text',
            text:
                'This digital device is part of a brand image design upgrade, primarily placed in store customer waiting areas. It allows customers to watch videos or play games while waiting to earn discount vouchers, making it a platform for navigation and services.',
        },
        {
            type: 'text',
            text:
                'This experience is based on web technologies, and I am responsible for the overall architecture and full program development.',
        },
        {
            type: 'images',
            images: [
                {
                    image: {
                        url: '/images/maxis/1.jpg',
                        alt: '',
                    },
                },
                {
                    image: {
                        url: '/images/maxis/2.jpg',
                        alt: '',
                    },
                },
                {
                    image: {
                        url: '/images/maxis/3.jpg',
                        alt: '',
                    },
                },
            ],
        },
        {
            type: 'video',
            video: {
                headline: 'Intro Video',
                url: '/images/maxis/video.mp4',
            },
        },
    ],
};

export default Contents;
