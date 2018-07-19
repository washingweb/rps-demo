# rsp

This is a demo of rock paper scissors game in solidty.

A basic commit-reveal pattern is used in this DApp. Please read [smart contract best practice: remember that on chain data is public](https://consensys.github.io/smart-contract-best-practices/recommendations/#remember-that-on-chain-data-is-public)
for more detail.

## how to use it
* Compile rps.sol and deploy (e.g. using remix)
* Edit app.js, replace address variable with your deployed contract address
* Start a httpserver (e.g. httpster), browse and open index.html. You need to install metamask to use this app
* Start **two** web pages, each one serve as a player. If play in single machine, do as following:
    * Open tab 1, switch account to address 1 in metamask, commit
    * Open tab 2, switch account to address 2 in metamask, commit
    * Go back to tab 1, switch account to address 1 in metamask, reveal
    * Go back to tab 2, switch account to address 2 in metamask, reveal
    * Go to any tab, choose winner, wait for result
    * If anything goes wrong, error will be in alert box. For out of gas problem, increase gas limit in metamask

This is for a live coding demo, and the contract/UI is not full-featured. Feel free to copy/modify it to make a more complete one.

Have fun :-)
