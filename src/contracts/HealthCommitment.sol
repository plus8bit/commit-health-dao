// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HealthCommitment
 * @dev Smart contract for health goal commitments with financial incentives
 */
contract HealthCommitment {
    struct Goal {
        address user;
        string description;
        uint256 depositAmount;
        uint256 startTime;
        uint256 durationInDays;
        bool completed;
        bool refunded;
        bool failed;
    }

    address public charityAddress;
    uint256 public goalCounter;
    mapping(uint256 => Goal) public goals;
    mapping(address => uint256[]) public userGoals;

    event GoalCommitted(
        uint256 indexed goalId,
        address indexed user,
        string description,
        uint256 depositAmount,
        uint256 durationInDays
    );
    event GoalCompleted(uint256 indexed goalId, address indexed user);
    event RefundClaimed(uint256 indexed goalId, address indexed user, uint256 amount);
    event GoalFailed(uint256 indexed goalId, address indexed user, uint256 amount);

    constructor(address _charityAddress) {
        require(_charityAddress != address(0), "Invalid charity address");
        charityAddress = _charityAddress;
    }

    /**
     * @dev Commit to a new health goal with ETH deposit
     * @param _description Goal description (e.g., "run 30 km in 10 days")
     * @param _durationInDays Duration for completing the goal
     */
    function commitGoal(string memory _description, uint256 _durationInDays) external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");
        require(bytes(_description).length > 0, "Description cannot be empty");

        uint256 goalId = goalCounter++;
        goals[goalId] = Goal({
            user: msg.sender,
            description: _description,
            depositAmount: msg.value,
            startTime: block.timestamp,
            durationInDays: _durationInDays,
            completed: false,
            refunded: false,
            failed: false
        });

        userGoals[msg.sender].push(goalId);

        emit GoalCommitted(goalId, msg.sender, _description, msg.value, _durationInDays);
    }

    /**
     * @dev Mark a goal as completed
     * @param _goalId ID of the goal to mark as completed
     */
    function markCompleted(uint256 _goalId) external {
        Goal storage goal = goals[_goalId];
        require(goal.user == msg.sender, "Not your goal");
        require(!goal.completed, "Already completed");
        require(!goal.failed, "Goal already failed");
        require(!goal.refunded, "Already refunded");
        require(
            block.timestamp <= goal.startTime + (goal.durationInDays * 1 days),
            "Goal duration expired"
        );

        goal.completed = true;
        emit GoalCompleted(_goalId, msg.sender);
    }

    /**
     * @dev Claim refund for a completed goal
     * @param _goalId ID of the goal to claim refund for
     */
    function claimRefund(uint256 _goalId) external {
        Goal storage goal = goals[_goalId];
        require(goal.user == msg.sender, "Not your goal");
        require(goal.completed, "Goal not completed");
        require(!goal.refunded, "Already refunded");
        require(!goal.failed, "Goal already failed");

        goal.refunded = true;
        uint256 refundAmount = goal.depositAmount;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundClaimed(_goalId, msg.sender, refundAmount);
    }

    /**
     * @dev Mark goal as failed and send funds to charity
     * @param _goalId ID of the goal to fail
     */
    function failGoal(uint256 _goalId) external {
        Goal storage goal = goals[_goalId];
        require(goal.user == msg.sender, "Not your goal");
        require(!goal.completed, "Goal already completed");
        require(!goal.failed, "Already failed");
        require(!goal.refunded, "Already refunded");
        require(
            block.timestamp > goal.startTime + (goal.durationInDays * 1 days),
            "Goal duration not expired yet"
        );

        goal.failed = true;
        uint256 charityAmount = goal.depositAmount;

        (bool success, ) = payable(charityAddress).call{value: charityAmount}("");
        require(success, "Transfer to charity failed");

        emit GoalFailed(_goalId, msg.sender, charityAmount);
    }

    /**
     * @dev Get all goal IDs for a user
     * @param _user Address of the user
     */
    function getUserGoals(address _user) external view returns (uint256[] memory) {
        return userGoals[_user];
    }

    /**
     * @dev Get goal details
     * @param _goalId ID of the goal
     */
    function getGoal(uint256 _goalId) external view returns (Goal memory) {
        return goals[_goalId];
    }

    /**
     * @dev Check if goal duration has expired
     * @param _goalId ID of the goal
     */
    function isGoalExpired(uint256 _goalId) external view returns (bool) {
        Goal memory goal = goals[_goalId];
        return block.timestamp > goal.startTime + (goal.durationInDays * 1 days);
    }

    /**
     * @dev Get time remaining for a goal (in seconds)
     * @param _goalId ID of the goal
     */
    function getTimeRemaining(uint256 _goalId) external view returns (uint256) {
        Goal memory goal = goals[_goalId];
        uint256 endTime = goal.startTime + (goal.durationInDays * 1 days);
        if (block.timestamp >= endTime) {
            return 0;
        }
        return endTime - block.timestamp;
    }
}
