// FAQ page - MANDATORY comprehensive documentation

import React, { useState } from "react";
import { formatTokenAmount } from "../utils/formatters.js";
import {
  STAKING_CONFIG,
  FAQ_CONTENT,
  CONTRACT_ADDRESSES,
} from "../utils/constants.js";

export const FAQPage = ({ appState }) => {
  const [expandedSections, setExpandedSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Filter FAQ content based on search
  const filteredContent = FAQ_CONTENT.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.questions.some(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-dark text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 border-2 border-army-green mx-auto mb-6 flex items-center justify-center">
            <span className="font-gilbert text-4xl text-army-green">❓</span>
          </div>
          <h1 className="font-gilbert text-4xl font-bold text-army-green-lighter mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-gilbert text-xl text-army-green-lighter">
            Comprehensive guide to staking, rewards, and protocol mechanics
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQ topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-dark-light border border-army-green-light text-white font-gilbert focus:border-army-green focus:outline-none"
            />
            <div className="absolute right-4 top-3 text-army-green-lighter">
              🔍
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-army-green bg-opacity-10 border border-army-green p-6 mb-8">
          <h2 className="font-gilbert text-xl font-bold text-army-green mb-4">
            Protocol Overview
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-gilbert text-army-green-lighter">
                Lock Period:
              </p>
              <p className="font-gilbert text-army-green font-bold">
                {STAKING_CONFIG.LOCK_PERIOD_DAYS} min
              </p>
            </div>
            <div>
              <p className="font-gilbert text-army-green-lighter">
                Penalty Rate:
              </p>
              <p className="font-gilbert text-army-green font-bold">
                {STAKING_CONFIG.PENALTY_PERCENTAGE}%
              </p>
            </div>
            <div>
              <p className="font-gilbert text-army-green-lighter">
                Initial APR:
              </p>
              <p className="font-gilbert text-army-green font-bold">
                {STAKING_CONFIG.INITIAL_APR}%
              </p>
            </div>
            <div>
              <p className="font-gilbert text-army-green-lighter">Min Stake:</p>
              <p className="font-gilbert text-army-green font-bold">
                {formatTokenAmount(STAKING_CONFIG.MIN_STAKE_AMOUNT)} tNODE
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border border-army-green-light mx-auto mb-4 flex items-center justify-center">
                <span className="font-gilbert text-2xl text-army-green-lighter">
                  🔍
                </span>
              </div>
              <p className="font-gilbert text-army-green-lighter">
                No FAQ entries match your search
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="font-gilbert mt-4 px-6 py-2 border border-army-green-light text-army-green-lighter hover:bg-army-green-light hover:text-white"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredContent.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-dark-light border border-army-green-light"
              >
                {/* Section Header */}
                <div
                  className="p-6 border-b border-army-green-light cursor-pointer hover:bg-dark"
                  onClick={() => toggleSection(`section-${sectionIndex}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h2 className="font-gilbert text-xl font-bold text-army-green-lighter">
                        {section.title}
                      </h2>
                    </div>
                    <span className="font-gilbert text-army-green-lighter">
                      {expandedSections.includes(`section-${sectionIndex}`)
                        ? "▼"
                        : "▶"}
                    </span>
                  </div>
                  <p className="font-gilbert text-army-green-lighter text-sm mt-2 ml-11">
                    {section.description}
                  </p>
                </div>

                {/* Section Content */}
                {expandedSections.includes(`section-${sectionIndex}`) && (
                  <div className="p-6 space-y-6">
                    {section.questions.map((faq, faqIndex) => (
                      <div
                        key={faqIndex}
                        className="bg-dark border border-army-green-light p-4"
                      >
                        <div
                          className="flex items-start justify-between cursor-pointer"
                          onClick={() =>
                            toggleSection(`faq-${sectionIndex}-${faqIndex}`)
                          }
                        >
                          <h3 className="font-gilbert text-army-green font-bold flex-1 mr-4">
                            {faq.question}
                          </h3>
                          <span className="font-gilbert text-army-green-lighter">
                            {expandedSections.includes(
                              `faq-${sectionIndex}-${faqIndex}`
                            )
                              ? "−"
                              : "+"}
                          </span>
                        </div>

                        {expandedSections.includes(
                          `faq-${sectionIndex}-${faqIndex}`
                        ) && (
                          <div className="mt-4 pt-4 border-t border-army-green-light">
                            <div
                              className="font-gilbert text-army-green-lighter prose prose-invert max-w-none"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-dark-light border border-army-green p-6">
          <h2 className="font-gilbert text-xl font-bold text-army-green-lighter mb-4">
            Still Have Questions?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => appState.navigateTo("/staking")}
              className="font-gilbert px-6 py-3 bg-army-green text-white border border-army-green hover:bg-army-green-light"
            >
              Start Staking
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.STAKING}`,
                  "_blank"
                )
              }
              className="font-gilbert px-6 py-3 border border-army-green-light text-army-green-lighter hover:bg-army-green-light hover:text-white"
            >
              View Contract
            </button>
            <button
              onClick={() =>
                setExpandedSections(
                  filteredContent.flatMap((_, sIdx) => [
                    `section-${sIdx}`,
                    ...Array.from(
                      { length: filteredContent[sIdx].questions.length },
                      (_, qIdx) => `faq-${sIdx}-${qIdx}`
                    ),
                  ])
                )
              }
              className="font-gilbert px-6 py-3 border border-army-green-light text-army-green-lighter hover:bg-army-green-light hover:text-white"
            >
              Expand All
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 bg-army-green bg-opacity-10 border border-army-green p-6 text-center">
          <h3 className="font-gilbert text-lg font-bold text-army-green mb-2">
            Need Additional Help?
          </h3>
          <p className="font-gilbert text-army-green-lighter mb-4">
            This is a testnet demonstration. For educational purposes only.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() =>
                window.open("https://github.com/trinnode/StakeSafariv2", "_blank")
              }
              className="font-gilbert px-4 py-2 border border-army-green text-army-green hover:bg-army-green hover:text-white"
            >
              GitHub
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.STAKING}`,
                  "_blank"
                )
              }
              className="font-gilbert px-4 py-2 border border-army-green text-army-green hover:bg-army-green hover:text-white"
            >
              Sepolia Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
