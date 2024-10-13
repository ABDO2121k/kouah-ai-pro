
import React from 'react';

const Welcom: React.FC = () => {
    return (
        <div className="text-center p-8">
            <h1 className="text-3xl font-bold">Documentation</h1>
            <h2 className="text-xl mt-4">Welcome to Kouah Ai documentation! 👋</h2>
            <div className="flex flex-wrap justify-center mt-8 space-x-4 space-y-4">
                <CardComponent title="Chatbot" description="Learn how to create a chatbot with DenserAI." link="/chatbot" />
                <CardComponent title="Integrations" description="Integrate DenserAI with your favorite tools." link="/integrations" />
                <CardComponent title="Billing" description="Understand how billing works with DenserAI." link="/billing" />
                <CardComponent title="FAQ" description="Find answers to frequently asked questions." link="/faq" />
            </div>
        </div>
    );
};

const CardComponent: React.FC<{ title: string; description: string; link: string }> = ({ title, description, link }) => {
    return (
        <div 
            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => window.location.href = link}
        >
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    );
};

export default Welcom;

