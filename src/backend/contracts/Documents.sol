// SPDX-License-Identifier:GPL-3.0

pragma solidity ^0.8.4;



contract Documents {
    
  address public owner;


  Document[] private documents;
  mapping (address => Count) private counts;

  enum DocStatus {Pending, Verified, Rejected}
 
  struct Document {
    address requester;
    address verifier;
    string name;
    string description;
    string docAddress;
    DocStatus status;
  }
  
  struct Count {
    uint verified;
    uint rejected;
    uint total;
  }

  event DocumentAdded (address user);
  event DocumentVerified (address user);
  event test (uint test);




  modifier docAddressExists(string memory _docAddress) 
  {
    bool found = false;
    for (uint i=0; i<documents.length; i++) {
      if (equal(documents[i].docAddress, _docAddress)) {
          found = true;
          break; 
      }
    }
    require(found==true,"The document is not found");
    _;
  }

 
  constructor() 
  {
    owner = msg.sender;
  }




  function addDocument(address _verifier, string memory _name, string memory _description, string memory _docAddress) 
  public 
  payable
  docAddressExists(_docAddress)
  {
    emit DocumentAdded(msg.sender);
    
    documents.push(
      Document({
        name: _name,
        requester: msg.sender,
        verifier: _verifier,
        description: _description,
        docAddress: _docAddress,
        status: DocStatus.Pending
      })
    );
    
    counts[msg.sender].total = counts[msg.sender].total + 1;
    counts[_verifier].total = counts[_verifier].total + 1;
  }

  
  function getDocument(string memory docAddress) 
  public 
  view 
  returns (string memory name, address requester, address verifier, string memory description, DocStatus status) {
    for (uint i=0; i<documents.length; i++) {
      if(equal(documents[i].docAddress, docAddress)){
        requester = documents[i].requester;
        verifier = documents[i].verifier;
        name = documents[i].name;
        description = documents[i].description;
        status = documents[i].status;
        break;
      }
    }
    return (name, requester, verifier, description, status);
  }
  
  function getVerifierDocuments(address _verifier, uint lIndex) 
  public 
  view 
  returns (string memory name, address requester, string memory description, string memory docAddress, DocStatus status, uint index) {
    for (uint i=lIndex; i<documents.length; i++) {
      if(documents[i].verifier == _verifier){
        requester = documents[i].requester;
        name = documents[i].name;
        description = documents[i].description;
        docAddress = documents[i].docAddress;
        status = documents[i].status;
        index = i;
        break;
      }
    }
    return (name, requester, description, docAddress, status, index);
  }
  
 
  function getRequesterDocuments(address _requester, uint lIndex) 
  public 
  view 
  returns (string memory name, address verifier, string memory description, string memory docAddress, DocStatus status, uint index) {
    for (uint i=lIndex; i<documents.length; i++) {
      if(documents[i].requester == _requester){
        verifier = documents[i].verifier;
        name = documents[i].name;
        description = documents[i].description;
        docAddress = documents[i].docAddress;
        status = documents[i].status;
        index = i;
        break;
      }
    }
    return (name, verifier, description, docAddress, status, index);
  }
  
 
  function verifyDocument(string memory docAddress, DocStatus status) 
  public 
  payable
  {
    for (uint i=0; i<documents.length; i++) {
      if(equal(documents[i].docAddress, docAddress) && documents[i].verifier == msg.sender && documents[i].status == DocStatus.Pending){
        emit DocumentVerified(msg.sender);
        if(status == DocStatus.Rejected){
            counts[documents[i].requester].rejected = counts[documents[i].requester].rejected + 1;
            counts[documents[i].verifier].rejected = counts[documents[i].verifier].rejected + 1;
        }
        if(status == DocStatus.Verified){
            counts[documents[i].requester].verified = counts[documents[i].requester].rejected + 1;
            counts[documents[i].verifier].verified = counts[documents[i].verifier].verified + 1;
        }
        documents[i].status = status;
        break;
      }
    }
  }


  function getCounts (address account) 
  public 
  view
  returns(uint verified, uint rejected, uint total) 
  {
    return (counts[account].verified, counts[account].rejected, counts[account].total);
  }


  function compare(string memory _a, string memory _b) public pure returns (int) {
      bytes memory a = bytes(_a);
      bytes memory b = bytes(_b);
      uint minLength = a.length;
      if (b.length < minLength) minLength = b.length;
      //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
      for (uint i = 0; i < minLength; i ++)
        if (a[i] < b[i])
          return -1;
        else if (a[i] > b[i])
          return 1;
      if (a.length < b.length)
        return -1;
      else if (a.length > b.length)
        return 1;
      else
        return 0;

      
  }

   function equal(string memory _a, string memory _b) public pure returns (bool) {
      return compare(_a, _b) == 0;
  }








  /// @dev Finds the index of the first occurrence of _needle in _haystack
  function indexOf(string memory _haystack, string memory _needle) public pure returns (int)
  {
    bytes memory h = bytes(_haystack);
    bytes memory n = bytes(_needle);
    if(h.length < 1 || n.length < 1 || (n.length > h.length)) 
      return -1;
    // since we have to be able to return -1 (if the char isn't found or input error), 
    // this function must return an "int" type with a max length of (2^128 - 1)
    else if(h.length > (2**128 -1)) 
      return -1;                                  
    else
    {
      uint subindex = 0;
      for (uint i = 0; i < h.length; i ++)
      {
        if (h[i] == n[0]) // found the first char of b
        {
          subindex = 1;
          // search until the chars don't match or until we reach the end of a or b
          while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) 
          {
            subindex++;
          }   
          if(subindex == n.length)
            return int(i);
        }
      }
      return -1;
    }   
  }



  
}