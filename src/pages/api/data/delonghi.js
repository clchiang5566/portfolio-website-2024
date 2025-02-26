const Contents = {
    title: 'Delonghi \nCoffee \nLounge',
    subtitle: '#KIOSK #FACEPRINT #IOT',
    color: '#ff9b85',
    index: 1,
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
                    label: 'Client:',
                    value: 'Delonghi Australia',
                },
                {
                    label: 'Agent:',
                    value: 'Landor & Fitch',
                },
                {
                    label: 'Type:',
                    value: 'Kiosk',
                },
            ],
        },
        {
            type: 'text',
            text:
                'De’Longhi Australia has opened the doors to its very first Coffee Lounge, a physical space designed for Australians to enhance their at-home coffee experience. It is designed to cater to Australians from beginner level interested to start their bean to cup journey in the home, to the more advanced trying their hand at being a home barista and those keen to further deepen their knowledge and skills.',
        },
        {
            type: 'text',
            text:
                'I was involved in only part of the front-end development for this project. I mainly want to highlight my experience with kiosks. This type of digital experience is ideal for various retail scenarios and can integrate diverse software and hardware technologies, such as AI, IoT, and facial recognition, to enable a wide range of applications.',
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
                        link:
                            'https://www.brandingmag.com/radu-dandu/the-art-of-brand-transformation-with-delonghi-and-landor-fitch/',
                    },
                    {
                        text: 'De’Longhi Launches New Immersive Coffee Experience With Landor & Fitch',
                        link:
                            'https://www.bandt.com.au/delonghi-launches-new-immersive-coffee-experience-with-landor-fitch/',
                    },
                ],
            },
        },
    ],
};

export default Contents;
