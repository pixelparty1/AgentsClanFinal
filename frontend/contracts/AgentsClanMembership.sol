// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentsClanMembership
 * @notice ERC-721 NFT contract for AgentsClan membership with gasless minting support
 * @dev Implements meta-transactions for zero-gas user experience on Polygon Amoy
 */
contract AgentsClanMembership is 
    ERC721, 
    ERC721URIStorage, 
    ERC721Enumerable, 
    Ownable, 
    EIP712, 
    ReentrancyGuard 
{
    using ECDSA for bytes32;

    // Membership tiers
    enum Tier { Free, Bronze, Silver, Gold, Platinum }

    struct MembershipData {
        Tier tier;
        uint256 xpBalance;
        uint256 mintedAt;
        bool isActive;
    }

    // EIP-712 type hash for meta-transactions
    bytes32 public constant MINT_TYPEHASH = keccak256(
        "MintRequest(address to,uint8 tier,string tokenURI,uint256 nonce,uint256 deadline)"
    );

    // State variables
    uint256 private _tokenIdCounter;
    address public trustedForwarder;
    string public baseTokenURI;
    
    // Mappings
    mapping(uint256 => MembershipData) public memberships;
    mapping(address => uint256) public membershipTokenId;
    mapping(address => uint256) public nonces;
    mapping(address => bool) public authorizedMinters;

    // Events
    event MembershipMinted(address indexed to, uint256 indexed tokenId, Tier tier);
    event MembershipUpgraded(uint256 indexed tokenId, Tier oldTier, Tier newTier);
    event XPAwarded(uint256 indexed tokenId, uint256 amount, uint256 newBalance);
    event TrustedForwarderUpdated(address indexed oldForwarder, address indexed newForwarder);

    constructor(
        address _trustedForwarder,
        string memory _baseTokenURI
    ) 
        ERC721("AgentsClan Membership", "ACM") 
        EIP712("AgentsClanMembership", "1")
        Ownable(msg.sender)
    {
        trustedForwarder = _trustedForwarder;
        baseTokenURI = _baseTokenURI;
        authorizedMinters[msg.sender] = true;
    }

    // ============ Modifiers ============

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[_msgSender()], "Not authorized minter");
        _;
    }

    // ============ Meta-Transaction Support ============

    /**
     * @notice Mint membership NFT with meta-transaction (gasless for user)
     * @param to Recipient address
     * @param tier Membership tier
     * @param tokenURI_ Token metadata URI
     * @param deadline Signature expiry timestamp
     * @param signature EIP-712 signature from authorized minter
     */
    function mintWithSignature(
        address to,
        Tier tier,
        string memory tokenURI_,
        uint256 deadline,
        bytes memory signature
    ) external nonReentrant {
        require(block.timestamp <= deadline, "Signature expired");
        require(membershipTokenId[to] == 0, "Already has membership");

        bytes32 structHash = keccak256(abi.encode(
            MINT_TYPEHASH,
            to,
            uint8(tier),
            keccak256(bytes(tokenURI_)),
            nonces[to]++,
            deadline
        ));

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signature);
        
        require(authorizedMinters[signer], "Invalid signature");

        _mintMembership(to, tier, tokenURI_);
    }

    /**
     * @notice Direct mint by authorized minter (owner pays gas)
     * @param to Recipient address
     * @param tier Membership tier
     * @param tokenURI_ Token metadata URI
     */
    function mint(
        address to,
        Tier tier,
        string memory tokenURI_
    ) external onlyAuthorizedMinter {
        require(membershipTokenId[to] == 0, "Already has membership");
        _mintMembership(to, tier, tokenURI_);
    }

    /**
     * @notice Internal mint function
     */
    function _mintMembership(
        address to,
        Tier tier,
        string memory tokenURI_
    ) internal {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        // Initialize membership data
        memberships[tokenId] = MembershipData({
            tier: tier,
            xpBalance: _getInitialXP(tier),
            mintedAt: block.timestamp,
            isActive: true
        });

        membershipTokenId[to] = tokenId;

        emit MembershipMinted(to, tokenId, tier);
    }

    // ============ Membership Management ============

    /**
     * @notice Upgrade membership tier
     * @param tokenId Token to upgrade
     * @param newTier New tier level
     */
    function upgradeTier(uint256 tokenId, Tier newTier) external onlyAuthorizedMinter {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(newTier > memberships[tokenId].tier, "Can only upgrade");

        Tier oldTier = memberships[tokenId].tier;
        memberships[tokenId].tier = newTier;
        
        // Award bonus XP for upgrade
        uint256 bonusXP = _getInitialXP(newTier) - _getInitialXP(oldTier);
        memberships[tokenId].xpBalance += bonusXP;

        emit MembershipUpgraded(tokenId, oldTier, newTier);
    }

    /**
     * @notice Award XP to a membership
     * @param tokenId Token to award XP
     * @param amount Amount of XP to award
     */
    function awardXP(uint256 tokenId, uint256 amount) external onlyAuthorizedMinter {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(memberships[tokenId].isActive, "Membership not active");

        memberships[tokenId].xpBalance += amount;
        
        emit XPAwarded(tokenId, amount, memberships[tokenId].xpBalance);
    }

    /**
     * @notice Batch award XP to multiple memberships
     * @param tokenIds Array of token IDs
     * @param amounts Array of XP amounts
     */
    function batchAwardXP(
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external onlyAuthorizedMinter {
        require(tokenIds.length == amounts.length, "Length mismatch");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_ownerOf(tokenIds[i]) != address(0) && memberships[tokenIds[i]].isActive) {
                memberships[tokenIds[i]].xpBalance += amounts[i];
                emit XPAwarded(tokenIds[i], amounts[i], memberships[tokenIds[i]].xpBalance);
            }
        }
    }

    /**
     * @notice Toggle membership active status
     * @param tokenId Token to toggle
     * @param isActive New active status
     */
    function setMembershipActive(uint256 tokenId, bool isActive) external onlyAuthorizedMinter {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        memberships[tokenId].isActive = isActive;
    }

    // ============ View Functions ============

    /**
     * @notice Get membership data for a token
     */
    function getMembership(uint256 tokenId) external view returns (MembershipData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return memberships[tokenId];
    }

    /**
     * @notice Get membership token ID for an address
     */
    function getMembershipTokenId(address owner) external view returns (uint256) {
        return membershipTokenId[owner];
    }

    /**
     * @notice Check if address has active membership
     */
    function hasActiveMembership(address owner) external view returns (bool) {
        uint256 tokenId = membershipTokenId[owner];
        return tokenId != 0 && memberships[tokenId].isActive;
    }

    /**
     * @notice Get tier for an address
     */
    function getTier(address owner) external view returns (Tier) {
        uint256 tokenId = membershipTokenId[owner];
        require(tokenId != 0, "No membership");
        return memberships[tokenId].tier;
    }

    /**
     * @notice Get XP balance for an address
     */
    function getXPBalance(address owner) external view returns (uint256) {
        uint256 tokenId = membershipTokenId[owner];
        require(tokenId != 0, "No membership");
        return memberships[tokenId].xpBalance;
    }

    /**
     * @notice Get total supply
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @notice Get current nonce for an address
     */
    function getNonce(address owner) external view returns (uint256) {
        return nonces[owner];
    }

    // ============ Admin Functions ============

    /**
     * @notice Add or remove authorized minter
     */
    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
    }

    /**
     * @notice Update trusted forwarder for meta-transactions
     */
    function setTrustedForwarder(address _trustedForwarder) external onlyOwner {
        address oldForwarder = trustedForwarder;
        trustedForwarder = _trustedForwarder;
        emit TrustedForwarderUpdated(oldForwarder, _trustedForwarder);
    }

    /**
     * @notice Update base token URI
     */
    function setBaseTokenURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    // ============ Internal Functions ============

    function _getInitialXP(Tier tier) internal pure returns (uint256) {
        if (tier == Tier.Bronze) return 100;
        if (tier == Tier.Silver) return 300;
        if (tier == Tier.Gold) return 1000;
        if (tier == Tier.Platinum) return 3000;
        return 0; // Free tier
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // ============ Override Functions ============

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);
        
        // Update membershipTokenId mappings on transfer
        if (from != address(0)) {
            membershipTokenId[from] = 0;
        }
        if (to != address(0)) {
            membershipTokenId[to] = tokenId;
        }
        
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
