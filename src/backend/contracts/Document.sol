// SPDX-License-Identifier:GPL-3.0

pragma solidity ^0.8.4;

contract Document{
    uint256 public noOfDocs;
    struct Docx{
        address sender;
        address receiver;
        string name;
        bool verified;
        string doc_address;
    }
    constructor(){
        noOfDocs = 0;
    }

    Docx [] public documents;
    
    // Events
    event Verified(address sender, address receiver);
    event AddedDoc(address sender,address receiver);

    function addDocument(address _receiver,string memory _name, string memory _docaddress) external {
        // Check if the receiver is same as sender
        require(_receiver!=msg.sender,"You cannot send the documents to yourself");
        // Now add it into the docs
        documents.push(Docx(msg.sender,_receiver,_name,false,_docaddress));
        // Emit an event
        emit AddedDoc(msg.sender, _receiver);
        noOfDocs = noOfDocs +1;
    }

    
    function verifyDoc(string memory _address) external {
        for(uint i=0;i<noOfDocs;i++){
            string memory add = documents[i].doc_address;
            if(equal(add,_address)){
                require(documents[i].receiver==msg.sender,"You aren't allowed to verify");
                documents[i].verified = true;
                emit Verified(documents[i].sender,msg.sender);
            }
        }
        
    }



    function compare(string memory _a, string memory _b) private pure returns (int) {
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

   function equal(string memory _a, string memory _b) private pure returns (bool) {
      return compare(_a, _b) == 0;
  }



  /// @dev Finds the index of the first occurrence of _needle in _haystack
  function indexOf(string memory _haystack, string memory _needle) private pure returns (int)
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