"use client";
import React from "react";
import Image from "next/image";
import { Linkedin, Facebook, Github, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  fullName: string;
  role: string;
  image: string;
  text: string;
  linkedin: string | null;
  facebook: string | null;
  github: string | null;
  whatsapp: string | null;
}

const teamMembers: TeamMember[] = [
  {
    fullName: "ABDELKADER KOUAH",
    role: "CEO, Co-Founder",
    image: "/images/ana.jpg",
    text: "Abdelkader is a proficient software engineer with a comprehensive background in various aspects of software development. His skill set encompasses frontend and backend technologies, UI/UX design, and DevOps methodologies. As a co-founder of Kouah AI, Abdelkader utilizes his diverse expertise to spearhead advancements and streamline operations within AI-driven solutions.",
    linkedin: null,
    facebook: null,
    github: null,
    whatsapp: "https://wa.me/212711670149",
  },
  // Add at least one more team member for testing
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm h-80 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group relative cursor-pointer mx-auto"
    >
      {/* Default view */}
      <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={member.image}
            alt={member.fullName}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          {member.fullName}
        </h3>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          {member.role}
        </p>
      </div>

      {/* Hover view */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
        <p className="text-sm text-center text-gray-300 mb-4">
            {member.text}
        </p>
        <div className="flex justify-center space-x-3">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {member.facebook && (
            <a
              href={member.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors duration-200"
            >
              <Github className="w-6 h-6" />
            </a>
          )}
          {member.whatsapp && (
            <a
              href={member.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-green-400 transition-colors duration-200"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function Team() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet our creative minds at the core of innovation, collaboration,
            and success. Together, we passionately shape the future with
            expertise.
          </p>
        </motion.div>

        <div className="flex justify-center">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
