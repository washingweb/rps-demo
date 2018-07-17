pragma solidity ^0.4.23;

contract Rsp {

    event Winner(address winner);

    address player1;
    address player2;
    
    bytes32 hash1;
    bytes32 hash2;
    
    string choice1;
    string choice2;
    
    address public winner;

    uint firstRevealTime;
    uint constant REVEAL_TIMEOUT = 30 minutes;
    
    mapping(string => mapping(string => uint)) payoffMatrix;
    
    constructor() public {
        // the second choice wins
        payoffMatrix["r"]["p"] = 2;
        payoffMatrix["p"]["s"] = 2;
        payoffMatrix["s"]["r"] = 2;
        
        // the first choice wins
        payoffMatrix["p"]["s"] = 1;
        payoffMatrix["s"]["p"] = 1;
        payoffMatrix["r"]["s"] = 1;
        
        // draw
        payoffMatrix["r"]["r"] = 0;
        payoffMatrix["s"]["s"] = 0;
        payoffMatrix["p"]["p"] = 0;
    }
    
    function _payoff(string _choice1, string _choice2) private view returns(uint) {
        return payoffMatrix[_choice1][_choice2];
    }
    
    function commit(bytes32 _hash) public {
        if (player1 == 0x0) {
            player1 = msg.sender;
            hash1 = _hash;
        } else if (player2 == 0x0) {
            player2 = msg.sender;
            hash2 = _hash;
        }
    }
    
    function reveal(string _choice, string _salt) public {
        if (msg.sender == player1 && hash1 == _hash(_choice, _salt)) {
            choice1 = _choice;
            if (bytes(choice2).length == 0) {
                firstRevealTime = block.timestamp;
            }
        } else if (msg.sender == player2 && hash2 == _hash(_choice, _salt)) {
            choice2 = _choice;
            if (bytes(choice1).length == 0) {
                firstRevealTime = block.timestamp;
            }
        }
    }
    
    function chooseWinner() public {
        if (bytes(choice1).length != 0 && bytes(choice2).length != 0)
        {
            uint result = _payoff(choice1, choice2);
            if (result == 0) {
                winner = 0x0;
            } else if (result == 1) {
                winner = player1;
            } else if (result == 2) {
                winner = player2;
            }
            
            emit Winner(winner);
            _reset();
        } else if (block.timestamp > firstRevealTime + REVEAL_TIMEOUT) { // timeout
            if (bytes(choice1).length != 0) {
                winner = player1;
            } else if (bytes(choice1).length != 0) {
                winner = player2;
            }
            
            if (winner != 0x0) {
                emit Winner(winner);
                _reset();
            }
        }
    }

    function _concat(bytes _bytes1, bytes _bytes2) private pure returns (bytes) {
        bytes memory _newValue = new bytes(_bytes1.length + _bytes2.length);

        uint i;
        uint j;

        for(i = 0; i < _bytes1.length; i++) {
            _newValue[j++] = _bytes1[i];
        }

        for(i = 0; i < _bytes2.length; i++) {
            _newValue[j++] = _bytes2[i];
        }

        return _newValue;
    }
    
    function _hash(string _choice, string _salt) private pure returns(bytes32) {
        bytes32 hash = keccak256(_concat(bytes(_choice), bytes(_salt))); 
        return hash;
    }

    function _reset() private {
        player1 = 0x0;
        player2 = 0x0;
        hash1 = "";
        hash2 = "";
        choice1 = "";
        choice2 = "";
        firstRevealTime = 0;
    }
}
