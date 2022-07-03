// SPDX-License-Identifier: nolicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./NFToken.sol";

contract NFTs is ERC721URIStorage {
    NFToken tokenContract;
    uint256 monthlyStakeReward;
    uint256 private tokenCount;
    mapping(address => uint256) public MintCount;
    mapping(uint256 => NFT) public AllNFTs;

    constructor(address NftTokenAddress) ERC721("MintNFT", "NFT") {
        monthlyStakeReward = 50 ether; // 50 NFTO
        tokenContract = NFToken(NftTokenAddress);
    }

    struct NFT {
        address owner;
        uint256 id;
        string name;
        string description;
        string imageUri;
        string uri;
        bool isSelling;
        uint256 price;
        bool isStaking;
        uint256 startStakeDate;
    }

    event NftMinted(uint256 ID, string URI);

    function mintNFT(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        string memory _tokenURI,
        uint256 price
    ) external {
        tokenContract.transferFrom(msg.sender, address(this), price);
        tokenCount++;
        _mint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        AllNFTs[tokenCount] = NFT(
            msg.sender,
            tokenCount,
            _name,
            _description,
            _imageURI,
            _tokenURI,
            false,
            0,
            false,
            0
        );
        MintCount[msg.sender]++;

        emit NftMinted(tokenCount, _tokenURI);
    }

    // price is in NFTokens
    function sellNFT(uint256 tokenId, uint256 price) external {
        require(
            tokenContract.hasTokens(msg.sender, price),
            "Insufficient funds"
        );
        address owner = AllNFTs[tokenId].owner;
        tokenContract.transferFrom(msg.sender, owner, price);
        this.transferFrom(owner, msg.sender, tokenId);
        AllNFTs[tokenId].owner = msg.sender;
        AllNFTs[tokenId].isSelling = false;
    }

    function getOwner(uint256 tokenId) external view returns (address) {
        return ownerOf(tokenId);
    }

    function listNFT(
        address owner,
        uint256 tokenId,
        uint256 price
    ) external {
        require(
            owner == AllNFTs[tokenId].owner,
            "Only owner can list his NFT!"
        );
        setApprovalForAll(address(this), true);
        AllNFTs[tokenId].isSelling = true;
        AllNFTs[tokenId].price = price;
    }

    function stakeNFT(address owner, uint256 tokenId) external {
        require(
            AllNFTs[tokenId].owner == owner,
            "Only owner can stake his NFTs."
        );
        AllNFTs[tokenId].isStaking = true;
        AllNFTs[tokenId].startStakeDate = block.timestamp;
    }

    function unstakeNFT(address owner, uint256 tokenId) external {
        require(
            AllNFTs[tokenId].owner == owner,
            "Only owner can unstake his NFTs."
        );
        uint256 stakedPeriod = block.timestamp -
            AllNFTs[tokenId].startStakeDate;
        uint256 stakedMonths = (stakedPeriod * 100) / 60 / 60 / 24 / 30 / 100;
        tokenContract.transfer(msg.sender, stakedMonths * monthlyStakeReward);
        AllNFTs[tokenId].isStaking = false;
    }

    function getTotalNFTsCount() external view returns (uint256) {
        return tokenCount;
    }

    function getNFT(uint256 _tokenId) external view returns (NFT memory) {
        return AllNFTs[_tokenId];
    }

    function isApproved(address owner) external view returns (bool) {
        return isApprovedForAll(owner, address(this));
    }
}
