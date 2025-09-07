import React from 'react';

const Accomodation = () => {
    document.title = "Registration | PYREXIA 2025"; // Set page title

    // Contact data for boys and girls
    const contacts = {
        boys: [
            { 
                name: "Boys: Click to Register", 
                duration: "8th to 12th Oct", 
                link: "https://docs.google.com/forms/d/e/1FAIpQLSc4afNgawems5g_cS9hvTb8OG0NO4pehl1jZwROtKcwuH1ceg/viewform?usp=dialog",
                people: [
                    { name: "Rahul", number: "9166680342" },
                    { name: "Vinod", number: "6375965544" }
                ]
            },
            { 
                name: "Boys: Click to Register", 
                duration: "8th to 11th Oct", 
                link: "https://docs.google.com/forms/d/e/1FAIpQLSdYF5Y9WR3FiXIBMrhnvIIyAjtOH_zJne012lDE-cM-vDUWfQ/viewform?usp=dialog",
                people: [
                    { name: "Abhay", number: "7081255622" },
                    { name: "Saarthak", number: "9896290373" }
                ]
            }
        ],
        girls: [
            { 
                name: "Girls: Click to Register", 
                duration: "8th to 12th Oct", 
                link: "https://docs.google.com/forms/d/e/1FAIpQLSf9DdObgIgxT1zod2HFPw7DpX5F40VI3nHqTmqEKgDb3wHJ3g/viewform?usp=dialog",
                people: [
                    { name: "Ishita", number: "8950962503" }
                ]
            },
            { 
                name: "Girls: Click to Register", 
                duration: "8th to 11th Oct", 
                link: "https://docs.google.com/forms/d/e/1FAIpQLSdhwsvS0tBPEkachVlV1TlfO9aRqjgiGF19BHrKlylE4i1gcw/viewform?usp=dialog",
                people: [
                    { name: "Smita", number: "8016641416" }
                ]
            }
        ]
    };

    return (
        <div className='bg-black min-h-screen'>
            {/* Header Section */}
            <div className="relative pt-28 pb-16 flex items-center justify-center">
                <h1 className="text-[#ebe6d0] text-center text-[3.5rem] font-semibold leading-[4.5rem] z-10 md:text-[3.7rem] md:px-12 md:leading-[3.5rem] uppercase font-shackleton">
                    Accommodation
                </h1>
            </div>

            {/* Content Section */}
            <div className="pb-20 flex relative items-center justify-center text-white">
                <div className="backdrop-blur-sm rounded-xl h-fit p-6 m-auto lg:px-10">
                    <div className="px-4 md:px-10 lg:px-10 text-lg font-light text-justify max-w-4xl border pt-10 pb-10">
                        <p className="mb-4">
                            Clean and comfortable accommodation options are available.
                        </p>
                        <p className="mb-4">
                            Our accommodation facilities provide basic amenities like clean linen, washrooms, and 24-hour water supply.
                        </p>
                        <p className="mb-4">
                            Accommodation booking can be done by the following links and you can contact the respective heads if you have any queries.
                        </p>
                        <p className="mb-8">
                            Our team will assist with any accommodation-related queries or concerns.
                        </p>

                        {/* Contacts Section */}
                        <div>

                            {/* Boys Section */}
                            <h3 className="text-xl font-semibold mb-4">Boys</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {contacts.boys.map((contact, index) => (
                                    <a key={index} href={contact.link} target="_blank" rel="noopener noreferrer">
                                        <div className="bg-[#ebe6d0] text-black hover:scale-105 transform duration-200 p-4 rounded-md shadow-lg">
                                            <h4 className="text-lg font-semibold">{contact.name}</h4>
                                            <p className="text-sm mb-2">{contact.duration}</p>
                                            {contact.people.map((p, i) => (
                                                <p key={i} className="text-sm">
                                                    {p.name}: <a href={`tel:${p.number}`} className="underline">{p.number}</a>
                                                </p>
                                            ))}
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Girls Section */}
                            <h3 className="text-xl font-semibold mt-8 mb-4">Girls</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {contacts.girls.map((contact, index) => (
                                    <a key={index} href={contact.link} target="_blank" rel="noopener noreferrer">
                                        <div className="bg-[#ebe6d0] text-black hover:scale-105 transform duration-200 p-4 rounded-md shadow-lg">
                                            <h4 className="text-lg font-semibold">{contact.name}</h4>
                                            <p className="text-sm mb-2">{contact.duration}</p>
                                            {contact.people.map((p, i) => (
                                                <p key={i} className="text-sm">
                                                    {p.name}: <a href={`tel:${p.number}`} className="underline">{p.number}</a>
                                                </p>
                                            ))}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Decorative Dots */}
                    <div className="flex items-center justify-center gap-3 pt-16 pb-16">
                        <div className="h-3 w-3 bg-[#ebe6d0] rotate-45"></div>
                        <div className="h-3 w-3 bg-[#ebe6d0] rotate-45"></div>
                        <div className="h-3 w-3 bg-[#ebe6d0] rotate-45"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accomodation;
