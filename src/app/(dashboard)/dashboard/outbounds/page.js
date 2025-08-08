"use client";

import {
  RiMailSendLine,
  RiAddLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiCalendarLine,
  RiMore2Fill,
} from "react-icons/ri";
import Link from "next/link";
import { useState, useEffect } from "react";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import axios from "axios";
import { apiSumary } from "@/app/utils/apiSummary";
import useUserStore from "@/app/utils/store/user";
import useSelectedOutboundStore from "@/app/utils/store/selectedoutbound";
import toast from "react-hot-toast";

export default function OutboundManagement() {
  const user = useUserStore((state) => state.user);
  const setSelectedOutbound = useSelectedOutboundStore((state) => state.setSelectedOutbound);
  const [campaigns, setCampaigns] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    campaignId: null,
    campaignName: ""
  });
  const [expandedEmails, setExpandedEmails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (id) => {
    try {
      // Add your API call to delete the campaign here
      // await axios.delete(`${apiSumary.delete_outbound}/${id}`);

      let response  = await axios.post(apiSumary.delete_outbound, {outbound_id: id})
       let result = response.data
        console.log(result)
       if (!result.success){
         throw new Error({message: result?.message})
       }
      
      toast.success("Outbound deleted")
      // Optimistic UI update
      setCampaigns(campaigns.filter((campaign) => campaign.outbound_id !== id));
      setDeleteConfirm({ isOpen: false, campaignId: null, campaignName: "" });
    } catch (error) {
      console.log("Failed to delete campaign:", error?.message);
      toast.error(error.message)
      // You might want to show an error message here
    }
  };

  async function getUserOutbounds() {
    setIsLoading(true);
    try {
      let result = await axios.post(apiSumary.get_user_outbounds, {
        userId: user.id,
      });

      if (result.data.success) {
        let campaigns = [];
        let useroutbounds = result.data.data;

        for (let i = 0; i < useroutbounds.length; i++) {
          let outbound_name = useroutbounds[i].outbound_name;
          let list_allocations = JSON.parse(useroutbounds[i].list_allocations);
          let created_at = new Date(useroutbounds[i].created_at).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          
          let receiverscount = 0;
          for (let i = 0; i < list_allocations.length; i++) {
            receiverscount += list_allocations[i].list.length;
          }
          
          campaigns.push({
            outbound_id: useroutbounds[i].id,
            deleted_email_list: useroutbounds[i].deleted_email_list,
            recipients_count: receiverscount,
            outbound_name,
            list_allocations,
            created_at,
          });
        }
        setCampaigns(campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) getUserOutbounds();
  }, [user?.id]);

  const toggleEmailExpansion = (id) => {
    setExpandedEmails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openDeleteModal = (index) => {
    const campaign = campaigns[index];
    setDeleteConfirm({
      isOpen: true,
      campaignId: campaign.outbound_id,
      campaignName: campaign.outbound_name
    });
  };

  return (
    <div className="space-y-6 pb-[60px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Outbound Email Campaigns
          </h2>
          <p className="text-sm text-gray-500">
            Manage your email sending campaigns
          </p>
        </div>
        <Link
          href="/dashboard/outbounds/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
        >
          <RiAddLine className="mr-2" />
          New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total Campaigns */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-md">
              <RiMailSendLine className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm text-gray-500">Total Campaigns</div>
              <div className="text-2xl font-semibold text-gray-900">
                {isLoading ? "..." : campaigns.length}
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Tasks */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-purple-100 p-3 rounded-md">
              <RiCalendarLine className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm text-gray-500">Scheduled Tasks</div>
              <div className="text-2xl font-semibold text-gray-900">
                0
              </div>
            </div>
          </div>
        </div>

        {/* All Tasks */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-md">
              <RiMailSendLine className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm text-gray-500">All Tasks</div>
              <div className="text-2xl font-semibold text-gray-900">
                0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No campaigns found. Create your first campaign to get started.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    From Addresses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign, index) => (
                  <tr key={campaign.outbound_id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.outbound_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-500">
                          {campaign.list_allocations[0]?.emailAssigned || 'N/A'}
                          {campaign.list_allocations.length > 1 && (
                            <span className="text-gray-400 ml-1">
                              +{campaign.list_allocations.length - 1}
                            </span>
                          )}
                        </div>
                        {campaign.list_allocations.length > 1 && (
                          <button
                            onClick={() => toggleEmailExpansion(index)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            aria-label="Show more emails"
                          >
                            <RiMore2Fill className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {expandedEmails[index] && (
                        <div className="mt-2 space-y-1">
                          {campaign.list_allocations
                            .slice(1)
                            .map((allocation, idx) => (
                              <div key={idx} className="text-xs text-gray-500">
                                {allocation.emailAssigned}
                              </div>
                            ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {campaign.recipients_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {campaign.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/dashboard/outbounds/${campaign.outbound_name}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        title="View"
                        onClick={() => setSelectedOutbound(campaign)}
                      >
                        <RiEyeLine className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/outbounds/${campaign.outbound_name}/newtask`}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title="Schedule"
                        onClick={() => setSelectedOutbound(campaign)}
                      >
                        <RiCalendarLine className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(index)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                        title="Delete"
                        aria-label={`Delete campaign ${campaign.outbound_name}`}
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onCancel={() => setDeleteConfirm({ isOpen: false, campaignId: null, campaignName: "" })}
        onConfirm={() => handleDelete(deleteConfirm.campaignId)}
        itemName={deleteConfirm.campaignName}
        title="Delete Campaign"
        message={`Are you sure you want to delete the campaign "${deleteConfirm.campaignName}"? This action cannot be undone.`}
      />
    </div>
  );
}