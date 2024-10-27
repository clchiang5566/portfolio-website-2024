const Contents = {
    title: 'Delonghi \nCoffee \nLounge',
    subtitle: '#KIOSK #FACEPRINT #IOT',
    color: '#ff9b85',
    index: 2,
    image: {
        href: '/images/img10.jpg',
    },
    footerTexture: '/texture/nomarl/Material_body_pink.png',
    content: [
        {
            type: 'info',
            headline: 'Info',
            content: [
                {
                    label: 'Year:',
                    value: '2022',
                },
                {
                    label: 'Type:',
                    value: 'Retail',
                },
                {
                    label: 'Devices:',
                    value: 'Kiosk',
                },
            ],
        },
        {
            type: 'text',
            text:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        },
        {
            type: 'images',
            images: [
                {
                    image: {
                        url: '/images/delonghi/img1.jpg',
                        alt: '',
                    },
                },
                {
                    image: {
                        url: '/images/delonghi/img2.jpg',
                        alt: '',
                    },
                },
                {
                    image: {
                        url: '/images/delonghi/img3.jpg',
                        alt: '',
                    },
                },
                {
                    image: {
                        url: '/images/delonghi/img4.jpg',
                        alt: '',
                    },
                }
            ],
        },
        {
            type: 'video',
            video: {
                headline: 'Showcase',
                url: 'https://vimeo.com/704024898',
            },
        },
        {
            type: 'links',
            relevant: {
                headline: 'Relevant Links',
                content: [
                    {
                        text: 'The Art of (Brand) Transformation, with De’Longhi and Landor & Fitch',
                        link: 'https://www.brandingmag.com/radu-dandu/the-art-of-brand-transformation-with-delonghi-and-landor-fitch/',
                    },
                    {
                        text: 'De’Longhi Launches New Immersive Coffee Experience With Landor & Fitch',
                        link: 'https://www.bandt.com.au/delonghi-launches-new-immersive-coffee-experience-with-landor-fitch/',
                    }
                ],
            },
        },
    ],
};

export default Contents;
