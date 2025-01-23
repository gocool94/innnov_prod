import React from 'react';

function InnovationPage() {
  return (
        <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-blue-500">Why Innovate with Us ?</h1>
        <p className="mt-4 text-black text-lg">
            Foster a Culture of Innovation: At Kipi Innovate, we believe every idea counts. Bring your ideas to life and contribute to the growth and evolution of our organization. Collaborate and Grow: Engage with like-minded colleagues, receive feedback, and enhance your ideas with diverse perspectives. Earn Recognition: Gain visibility and appreciation for your innovative ideas. Win rewards and climb the leaderboard!
        </p>
        <br></br>
        <h1 className="text-2xl font-bold text-blue-500">How Does It Work ?</h1>
        <div className="mt-4 text-black">
    <strong>Submit Your Idea:</strong>
    <ul className="list-disc list-inside ml-6 text-lg">
      <li>Share a brief overview of your idea using our intuitive submission form. You can also leverage our LLM Chatbot for guidance on initial ideation.</li>
    </ul>
  </div>
  <div className="mt-4 text-black">
    <strong>Internal Review:</strong>
    <ul className="list-disc list-inside ml-6 text-lg">
      <li>Once submitted, your idea goes through an internal review process where department heads and relevant stakeholders provide feedback.</li>
    </ul>
  </div>
  <div className="mt-4 text-black">
    <strong>Feedback and Refinement:</strong>
    <ul className="list-disc list-inside ml-6 text-lg">
      <li>Collaborate and refine your idea based on feedback from peers and stakeholders. Enhance your idea with additional insights and suggestions.</li>
    </ul>
  </div>
  <div className="mt-4 text-black text-lg">
    <strong>Jury Evaluation:</strong>
    <ul className="list-disc list-inside ml-6">
      <li>Finalized ideas are presented to a jury for evaluation. The best ideas are awarded, and top contributors are recognized on our leaderboard.</li>
    </ul>
  </div>
 </div>
  );
}

export default InnovationPage;