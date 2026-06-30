export const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllCampaigns",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "targetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadLine",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
        ],
        internalType: "struct ICrowdFunding.Campaign[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
    ],
    name: "getCampaignById",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "targetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadLine",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
        ],
        internalType: "struct ICrowdFunding.Campaign",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserFundedAmountById",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "targetAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadLine",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "launch",
    outputs: [
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
    ],
    name: "pledge",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "CrowdFund__AlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__CampaignExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__CampaignInProgress",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__CampaignNotEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__DeadLineMustBeFuture",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__InvalidTargetAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__MoreThanZeroPledge",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__MustHaveDescription",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__MustHaveTitle",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__NoMatchingCampaign",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__NotBackerForThisCampaign",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__NotCampaignOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__TargetAlreadyMet",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__TargetNotMet",
    type: "error",
  },
  {
    inputs: [],
    name: "CrowdFund__TransferFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Claim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetAmount",
        type: "uint256",
      },
    ],
    name: "LaunchCrowdFund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "backor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PledgeFund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "backer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "campaignId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Refund",
    type: "event",
  },
] as const;
