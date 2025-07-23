'use client';

import { RiMailSendLine, RiDeleteBinLine, RiCalendarLine, RiArrowLeftLine, RiListUnordered, RiEditLine } from 'react-icons/ri';
import { FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { useState, useEffect } from 'react';
import useSelectedOutboundStore from "@/app/utils/store/selectedoutbound";

// Mock data
const campaignData = {
  id: '1',
  name: 'Summer Sale 2023',
  assignedEmails: ['marketing@company.com', 'support@company.com'],
  created: 'June 10, 2023',
  lastSent: 'June 15, 2023 (3 days ago)',
  totalSent: 1245,
  openRate: '27.5%',
  clickRate: '9.3%',
  emailListId: 'premium-customers'
};

const scheduledTasks = [
  {
    id: '1',
    subject: 'Summer Sale - 20% Off Everything!',
    scheduledFor: 'June 20, 2023 at 9:00 AM',
    status: 'scheduled',
    emailsToSend: 845,
    previewText: 'Don\'t miss our biggest sale of the season! Get 20% off all items for a limited time only.'
  },
  {
    id: '2',
    subject: 'Summer Sale Reminder - Last Chance!',
    scheduledFor: 'June 25, 2023 at 9:00 AM',
    status: 'scheduled',
    emailsToSend: 845,
    previewText: 'Final reminder - your 20% discount expires soon! Shop now before it\'s gone.'
  }
];

const completedTasks = [
  {
    id: '1',
    subject: 'Summer Sale Starts Now!',
    sentAt: 'June 15, 2023 at 9:30 AM',
    sentFrom: 'marketing@company.com',
    emailsSent: 845,
    opens: 342,
    clicks: 127,
    previewText: 'Our annual summer sale is here! Enjoy exclusive discounts on your favorite products.'
  },
  {
    id: '2',
    subject: 'Exclusive Summer Offer for You',
    sentAt: 'June 10, 2023 at 10:15 AM',
    sentFrom: 'support@company.com',
    emailsSent: 400,
    opens: 210,
    clicks: 85,
    previewText: 'As a valued customer, we\'re offering you early access to our summer collection.'
  }
];

export default function CampaignDetail() {
  const selectedoutbound = useSelectedOutboundStore((state)=>state.selectedoutbound)
  const params = useParams();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [expandedTask, setExpandedTask] = useState(null);




  const campaign = campaignData;

  const handleDelete = () => {
    console.log('Deleting campaign:', params.id);
    alert('Campaign deleted successfully!');
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard/outbounds" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2">
            <RiArrowLeftLine className="mr-1" /> Back to campaigns
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedoutbound?.outbound_name}</h1>
        </div>
        <div className="flex gap-3">
          {/* <Link
            href={`/dashboard/outbounds/${params.outboundname}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <RiEditLine className="mr-2" /> Edit
          </Link> */}
          <button
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            <RiDeleteBinLine className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Sent</div>
          <div className="text-2xl font-semibold text-gray-900">{campaign.totalSent.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Open Rate</div>
          <div className="text-2xl font-semibold text-green-600">{campaign.openRate}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Click Rate</div>
          <div className="text-2xl font-semibold text-blue-600">{campaign.clickRate}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Last Sent</div>
          <div className="text-lg font-medium text-gray-900">{campaign.lastSent}</div>
        </div>
      </div> */}

      {/* Campaign Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Details</h2>
          <Link 
            href={`/dashboard/email-lists/${campaign.emailListId}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            View recipient list <FiExternalLink className="ml-1" />
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Sending From</h3>
          <div className="flex flex-wrap gap-2">
           {
           selectedoutbound?.list_allocations.map((allocation, index)=>(
                <span key={index} className="bg-gray-50 px-3 py-1.5 rounded-md text-sm border border-gray-200">
                {allocation.emailAssigned}
              </span>
            ))
           }
           
           
        
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
            <p className="text-gray-900">{selectedoutbound?.created_at}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Campaign ID</h3>
            <p className="text-gray-900 font-mono">{campaign.id}</p>
          </div>
        </div>
      </div>

      {/* Schedule New Task */}
      <div className="bg-indigo-50 rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-medium text-gray-900">Ready to send another email?</h3>
            <p className="text-sm text-gray-600">Schedule a new task for this campaign</p>
          </div>
          <Link
            href={`/dashboard/outbounds/${params.outboundname}/newtask`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
          >
            <RiCalendarLine className="mr-2" />
            Schedule New Task
          </Link>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'scheduled' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Scheduled
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {scheduledTasks.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'completed' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Completed
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {completedTasks.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'scheduled' ? (
            <>
              {scheduledTasks.length > 0 ? (
                <div className="space-y-4">
                  {scheduledTasks.map(task => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-all">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-gray-900">{task.subject}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Scheduled
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{task.previewText}</p>
                          
                          {expandedTask === task.id && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Scheduled for</p>
                                  <p className="text-sm font-medium">{task.scheduledFor}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Recipients</p>
                                  <p className="text-sm font-medium">{task.emailsToSend.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                          <button 
                            onClick={() => toggleTaskExpansion(task.id)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200"
                          >
                            {expandedTask === task.id ? 'Show Less' : 'Details'}
                          </button>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md border border-indigo-100">
                              Edit
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-100">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <RiCalendarLine className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-3 text-sm font-medium text-gray-900">No scheduled tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">Schedule your first email task to get started.</p>
                  <div className="mt-6">
                    <Link
                      href={`/dashboard/outbounds/${params.outboundname}/newtask`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <RiCalendarLine className="mr-2" />
                      Schedule Task
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {completedTasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opens</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedTasks.map(message => (
                        <tr key={message.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 max-w-xs">
                            <div className="font-medium text-gray-900">{message.subject}</div>
                            <div className="text-sm text-gray-500 truncate">{message.previewText}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {message.sentAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {message.sentFrom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{message.opens.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{Math.round((message.opens / message.emailsSent) * 100)}% rate</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{message.clicks.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{Math.round((message.clicks / message.emailsSent) * 100)}% rate</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Resend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <RiMailSendLine className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-3 text-sm font-medium text-gray-900">No completed tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">Your scheduled tasks will appear here once sent.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirm}
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? All scheduled tasks will be cancelled and this action cannot be undone."
      />
    </div>
  );
}