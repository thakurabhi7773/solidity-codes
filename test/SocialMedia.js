const { expect } = require("chai");
const ethers = require("ethers")

describe("SocialMedia", () => {
  let socialMedia;

  beforeEach(async () => {
    const SocialMedia = await ethers.getContractFactory("SocialMedia");
    console.log("1", SocialMedia)
    socialMedia = await SocialMedia.deploy();
    console.log("2", socialMedia)
    await socialMedia.deployed();
  });

  it("should create a post", async () => {
    const ipfsHash = "Qm..."; // Replace with a valid IPFS hash
    console.log("3", socialMedia)

    const postCountBefore = await socialMedia.postCount();
    console.log("4", socialMedia)


    await socialMedia.createPost(ipfsHash);

    const postCountAfter = await socialMedia.postCount();
    const createdPost = await socialMedia.posts(postCountBefore);

    expect(postCountAfter).to.equal(postCountBefore.add(1));
    expect(createdPost.ipfsHash).to.equal(ipfsHash);
    expect(createdPost.author).to.equal(await ethers.provider.getSigner().getAddress());
  });

  it("should get all posts", async () => {
    const ipfsHash1 = "Qm..."; // Replace with a valid IPFS hash for the first post
    const ipfsHash2 = "Qm..."; // Replace with a valid IPFS hash for the second post

    await socialMedia.createPost(ipfsHash1);
    await socialMedia.createPost(ipfsHash2);

    const allPosts = await socialMedia.getAllPosts();

    expect(allPosts.length).to.equal(2);
    expect(allPosts[0].ipfsHash).to.equal(ipfsHash1);
    expect(allPosts[1].ipfsHash).to.equal(ipfsHash2);
  });
});
