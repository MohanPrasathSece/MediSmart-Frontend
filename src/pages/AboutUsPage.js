import React from 'react';
import { Mail, Linkedin } from 'lucide-react';

const team = [
  { name: 'Mohan Prasath S', role: 'Co‑creator', email: 'mohanprasath563@gmail.com', linkedin: 'https://www.linkedin.com/in/mohan-prasath-fullstackdeveloper/' },
  { name: 'Mugilan V', role: 'Co‑creator', email: 'mugilan.v2023ece@sece.ac.in', linkedin: 'https://www.linkedin.com/in/mugilan-v-921917291/' },
  { name: 'Madhavan RT', role: 'Co‑creator', email: 'madhavan.rt2023ece@sece.ac.in', linkedin: 'https://www.linkedin.com/in/madhavan-r-t-185085371?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
];

const Initials = ({ name }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
  return (
    <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
      {initials}
    </div>
  );
};

const AboutUsPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 mb-2">About Us</h1>
        <p className="text-secondary-700 mb-8">
          We are a small team passionate about simplifying access to medicines using AI and modern delivery experiences.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">Our Mission</h2>
          <p className="text-secondary-700">
            Empower users to compare prices across pharmacies, upload prescriptions securely, and receive timely doorstep delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Team</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map(member => (
              <li key={member.name} className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
                <div className="flex items-center gap-3 mb-3">
                  <Initials name={member.name} />
                  <div>
                    <p className="font-semibold text-secondary-900">{member.name}</p>
                    <p className="text-xs text-secondary-600">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-secondary-500" />
                  {member.email ? (
                    <a href={`mailto:${member.email}`} className="text-primary-700 hover:underline">{member.email}</a>
                  ) : (
                    <span className="text-secondary-700">Email: to be provided</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Linkedin size={16} className="text-secondary-500" />
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-700 hover:underline"
                      title={member.linkedin}
                    >
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-secondary-700">LinkedIn: to be provided</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
