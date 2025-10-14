# EduChain Project Reorganization Plan

## Current Issues

1. **Duplicate Backend**: Both `backend/` and `server/` folders exist
2. **Root `server.js`**: Entry point at wrong location
3. **Mixed Documentation**: Docs scattered across root and subfolders
4. **Hardhat Files**: Smart contract files mixed with app code

## Proposed Root Structure

```
EduChain/
├── client/                 # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── tests/         # Test files
│   │   ├── docs/          # Documentation
│   │   ├── utils/         # Utilities
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # React contexts
│   │   ├── config/        # Configuration
│   │   ├── assets/        # Images & icons
│   │   ├── layouts/       # Layouts
│   │   └── examples/      # Examples
│   ├── package.json
│   └── README.md
│
├── server/                 # Backend Express Application
│   ├── controllers/       # Route handlers
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Auth & validation
│   ├── services/          # External APIs
│   ├── config/            # Configuration
│   ├── utils/             # Helper functions
│   ├── tests/             # Test files
│   ├── scripts/           # Utility scripts
│   ├── docs/              # Documentation
│   ├── uploads/           # Temporary files
│   ├── index.js           # Entry point
│   ├── package.json
│   └── .env
│
├── contracts/              # Smart Contracts
│   ├── BookMarketplace.sol
│   ├── EduChainNFT.sol
│   └── Lock.sol
│
├── scripts/                # Hardhat Scripts
│   ├── deploy-nft.js
│   ├── deploy.js
│   └── start-local-network.js
│
├── test/                   # Hardhat Tests
│   └── Lock.js
│
├── docs/                   # Project Documentation
│   ├── ADDRESS_CONFIGURATION.md
│   ├── APPLE_SETUP.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DOCUMENTATION.md
│   ├── GOOGLE_CLIENT_ID_GUIDE.md
│   ├── GOOGLE_SETUP.md
│   ├── HARDHAT_LOCAL_SETUP.md
│   ├── NFT_ENV_SETUP.md
│   ├── NFT_MINTING_README.md
│   ├── PROJECT_DOCUMENTATION.md
│   ├── TECHNICAL_DOCUMENTATION.md
│   └── TWILIO_SETUP.md
│
├── artifacts/              # Hardhat Build Artifacts
├── cache/                  # Hardhat Cache
├── deployments/            # Deployment Records
├── ignition/               # Hardhat Ignition
│
├── .env                    # Root Environment Variables
├── .gitignore
├── hardhat.config.js       # Hardhat Configuration
├── package.json            # Root Package (Hardhat)
├── package-lock.json
└── README.md               # Project README
```

## Actions Required

### 1. Rename Folders
- `backend/` → `server/`
- Remove old `server/` folder (appears to be outdated)

### 2. Move Documentation
- All `*.md` files from root → `docs/`
- Keep only `README.md` at root

### 3. Clean Up Root
- Remove `server.js` from root (use `server/index.js`)
- Keep only essential config files at root

### 4. Update Package Scripts
- Update `package.json` scripts to reference `server/` instead of `backend/`

## Risk Assessment

**Low Risk:**
- Moving documentation files
- Renaming backend → server
- Organizing test files

**Medium Risk:**
- Updating package.json scripts
- Removing old server/ folder

**High Risk:**
- None (no code changes)

## Recommendation

Since the current structure already has:
- ✅ Well-organized `backend/` folder
- ✅ Well-organized `client/` folder
- ✅ Proper separation of concerns

**Recommended Action**: Keep current structure with minor cleanup:
1. Move documentation to `docs/`
2. Keep `backend/` name (already established)
3. Remove duplicate `server/` folder
4. Clean up root level

This avoids breaking any existing scripts or deployment configurations.











