'use client';

import { useState } from 'react';
import {
  RiArrowLeftLine,
  RiSendPlaneLine,
  RiMailLine,
  RiCalendar2Line,
  RiTimer2Line,
  RiMailAddLine,
  RiMailCheckLine
} from 'react-icons/ri';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NewScheduledTask() {
  const params = useParams();

  const [formData, setFormData] = useState({
    taskType: 'new',
    subject: '',
    body: '',
    scheduledDate: '',
    sendingSpeed: 5
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Task scheduled:', formData);
    alert('Task scheduled successfully!');
  };

  return (
    <div className="pb-[60px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/dashboard/outbounds/${params.id}`}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <RiArrowLeftLine className="mr-1" />
          Back to campaign
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <RiMailAddLine className="text-indigo-600" />
        New Task
      </h1>
      <p className="text-gray-600 mb-6">For: AZAudiovideo.com | Task: {params.id}</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-6 border border-gray-100"
      >
        {/* Task Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <RiMailCheckLine className="text-gray-500" />
            Task Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, taskType: 'new' }))}
              className={`p-3 border rounded-lg text-center transition ${
                formData.taskType === 'new'
                  ? 'border-indigo-500 bg-indigo-50 shadow'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium flex items-center justify-center gap-1">
                <RiMailLine />
                New Email
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, taskType: 'followup' }))}
              className={`p-3 border rounded-lg text-center transition ${
                formData.taskType === 'followup'
                  ? 'border-indigo-500 bg-indigo-50 shadow'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium flex items-center justify-center gap-1">
                <RiMailCheckLine />
                Follow Up
              </div>
            </button>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <RiMailLine className="text-gray-500" />
            Email Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <RiMailLine className="text-gray-500" />
            Email Body (Text)
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            value={formData.body}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>

        {/* Schedule & Speed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <RiCalendar2Line className="text-gray-500" />
              Schedule Date
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="sendingSpeed" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <RiTimer2Line className="text-gray-500" />
              Sending Speed (sec)
            </label>
            <input
              type="number"
              id="sendingSpeed"
              name="sendingSpeed"
              min="1"
              max="60"
              value={formData.sendingSpeed}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition"
          >
            <RiSendPlaneLine className="mr-2" />
            Add New Task
          </button>
        </div>
      </form>
    </div>
  );
}
