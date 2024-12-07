/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useMemo, useState } from "react";
import { useSteps } from "../context";
import { useAccount } from "wagmi";

const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

const upload = async (body: string) => {
  const url = `${PUBLISHER}/v1/store`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error:", error.message);
    return null;
  }
};

const getBlobId = (result: any) => {
  if (result) {
    if (result["alreadyCertified"]) {
      // Blob was already uploaded before
      return result["alreadyCertified"]["blobId"];
    } else if (result["newlyCreated"]) {
      // Blob was newly uploaded
      return result["newlyCreated"]["blobObject"]["blobId"];
    }
  }
};

export default function Step3View() {
  const { jsonData, negotiationID, option } = useSteps();
  const [loading, setLoading] = useState(false);
  const [uploadDecision, setUploadDecision] = useState<"pending" | "yes" | "no">("pending");
  const [uploaded, setUploaded] = useState(false);
  const [finalBlobId, setFinalBlobId] = useState<string | null>(null);

  const { address } = useAccount();
  const key = useMemo(() => `${address}-my-blob-ids`, [address]);

  const _upload = useCallback(async () => {
    setLoading(true);
    const res = await upload(JSON.stringify(jsonData));
    if (res) {
      const blobId = getBlobId(res);

      // Handle blob IDs as before
      const blobIdsStr = localStorage.getItem(key);
      let blobIds = JSON.parse(blobIdsStr === null ? "[]" : blobIdsStr) as Array<string>;

      if (option === "enter") {
        blobIds = blobIds.filter((id) => id !== negotiationID);
      }
      blobIds.push(blobId);
      localStorage.setItem(key, JSON.stringify(blobIds));

      setFinalBlobId(blobId);
      setUploaded(true);
    }
    setLoading(false);
  }, [jsonData, negotiationID, option, key]);

  return (
    <div className="p-4">
      {uploadDecision === "pending" && !uploaded && !loading && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 3: Upload Confirmation</h2>
          <p>Do you want to upload the data to Walrus?</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => {
                setUploadDecision("yes");
                _upload();
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={() => setUploadDecision("no")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              No
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Uploading data to Walrus...</div>
        </div>
      )}

      {uploadDecision === "no" && !uploaded && !loading && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 3: Upload Skipped</h2>
          <p>You chose not to upload the data.</p>
        </div>
      )}

      {!loading && uploaded && finalBlobId && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Step 3: Network Call Complete
          </h2>
          <p>Uploaded data to Walrus successfully!</p>
          <p className="mt-4 font-medium">
            Here is your negotiation ID: <span className="text-blue-600">{finalBlobId}</span>.  
            Share it with the person you want to negotiate with.
          </p>
        </div>
      )}
    </div>
  );
}
