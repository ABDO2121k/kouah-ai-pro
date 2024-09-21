import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-5 shadow-md shadow-[#06b6d4]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Image
            src="/images/logo.png"
            alt="LOGO"
            sizes="100vw"
            style={{
              width: "200px",
              height: "auto",
            }}
            width={0}
            height={0}
          />{" "}
          <p className="text-sm p-3 text-center">
            Revolutionizing AI-powered solutions for businesses and individuals.
          </p>
        </div>

        <div className="flex space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <Github size={24} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <Linkedin size={24} />
          </a>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8">
        <p>&copy; {new Date().getFullYear()} Kouah AI. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
