// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocialMedia {
    struct Post {
        string ipfsHash;
        address author;
        uint256 timestamp;
    }

    mapping(uint256 => Post) public posts;

    uint256 public postCount;

    event PostCreated(uint256 postId, string ipfsHash, address author, uint256 timestamp);

    function createPost(string calldata _ipfsHash) public {
        posts[postCount] = Post(_ipfsHash, msg.sender, block.timestamp);
        postCount++;
        emit PostCreated(postCount - 1, _ipfsHash, msg.sender, block.timestamp);
    }
    // this function might be faile if post count increase upto 900. i made this function to fulfill task requirement 
    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 0; i < postCount; i++) {
            allPosts[i] = posts[i];
        }
        return allPosts;
    }
}
