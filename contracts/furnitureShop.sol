// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract FurnitureShop {
    address public owner;

    // ROLES
    uint256 public constant ROLE_ADMIN = 1;
    uint256 public constant ROLE_EDITOR = 2;
    mapping(address => uint256) public roles;

    event ItemAdded(
        uint256 id,
        uint256 price,
        uint256 quantity,
        uint256 points,
        string name,
        string description,
        string image
    );
    event PurchasedItem(
        address user,
        uint256 id,
        uint256 quantity,
        uint256 price,
        uint256 paidAmount
    );

    struct Item {
        uint256 id;
        uint256 price;
        uint256 quantity;
        uint256 points; // loyality points
        string name;
        string description;
        string image;
    }

    struct PurchaseItem {
        uint256 id;
        uint256 price; // price on which user bought it
        uint256 quantity;
    }

    mapping(address => uint256) public user_items_count; // total items of user
    mapping(address => mapping(uint256 => PurchaseItem)) public user_items; // user items

    uint256 public total_items = 0;
    mapping(uint256 => Item) public items;

    uint256 public discount_per_point = 1000; // 1%
    uint256 public max_discount = 50000; //50%    // max discount is 50% of price
    mapping(address => uint256) public loyality_points;

    constructor() {
        owner = msg.sender;
    }

    // modifiers

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not allowed.");
        _;
    }

    modifier onlyAdmin() {
        require(
            roles[msg.sender] == ROLE_ADMIN || msg.sender == owner,
            "You are not allowed."
        );
        _;
    }

    modifier onlyEditor() {
        require(
            roles[msg.sender] != 0 || msg.sender == owner,
            "You are not allowed."
        );
        _;
    }

    modifier correctItemId(uint256 id) {
        require(id <= total_items, "Id doesn't exsist.");
        _;
    }

    function updateOwner(address newowner) public onlyOwner {
        owner = newowner;
    }

    function addRole(address user, uint256 roleid) public onlyOwner {
        require(
            roleid == ROLE_ADMIN || roleid == ROLE_EDITOR,
            "Role not correct."
        );
        roles[user] = roleid;
    }

    function getRole(address user) external view returns (uint256) {
        return roles[user];
    }

    modifier correctItemQuantity(uint256 id, uint256 q) {
        require(q <= items[id].quantity, "Quantity nhi hae.");
        _;
    }

    function incTotalItems() private {
        total_items++;
    }

    function getItemPrice(uint256 id, uint256 quantity)
        public
        view
        correctItemId(id)
        correctItemQuantity(id, quantity)
        returns (uint256)
    {
        return items[id].price * quantity;
    }

    function getItemPrice(uint256 id)
        external
        view
        correctItemId(id)
        returns (uint256)
    {
        return items[id].price;
    }

    function getDiscountedPrice(uint256 price, uint256 userpoints)
        public
        view
        returns (uint256, uint256)
    {
        // userpoints=4000, price 10
        uint256 discount = 0;
        discount = userpoints * discount_per_point; // discount = 4000*1000=4,000,000
        if (discount > max_discount) discount = max_discount; // 50,000
        uint256 discount_price = (price * discount) / 100000;
        return (price - discount_price, userpoints - (discount / 1000)); // discounted price, remaining loyality points
    }

    function updateItemPrice(uint256 id, uint256 _newval)
        public
        onlyEditor
        correctItemId(id)
    {
        require(_newval > 0, "Value should be greater than 0.");
        items[id].price = _newval;
    }

    function updateItemQuantity(uint256 id, uint256 _newval)
        public
        onlyEditor
        correctItemId(id)
    {
        require(_newval >= 0, "Value should be greater than 0.");
        items[id].quantity = _newval;
    }

    function updateItemPoints(uint256 id, uint256 _newval)
        public
        onlyEditor
        correctItemId(id)
    {
        items[id].points = _newval;
    }

    function updateItemName(uint256 id, string memory _newval)
        public
        onlyEditor
        correctItemId(id)
    {
        items[id].name = _newval;
    }

    function updateItemDescription(uint256 id, string memory _newval)
        public
        onlyEditor
        correctItemId(id)
    {
        items[id].description = _newval;
    }

    function updateItemImage(uint256 id, string memory _newval)
        public
        onlyEditor
        correctItemId(id)
    {
        items[id].image = _newval;
    }

    function addItem(
        uint256 price,
        uint256 quantity,
        uint256 points,
        string memory name,
        string memory description,
        string memory image
    ) public onlyAdmin {
        _addItem(price, quantity, points, name, description, image);
        emit ItemAdded(
            total_items,
            price,
            quantity,
            points,
            name,
            description,
            image
        );
    }

    function _addItem(
        uint256 _price,
        uint256 _quantity,
        uint256 _points,
        string memory _name,
        string memory _description,
        string memory _image
    ) private {
        items[total_items] = Item(
            total_items,
            _price,
            _quantity,
            _points,
            _name,
            _description,
            _image
        );
        incTotalItems();
    }

    function getItem(uint256 id) public view returns (Item memory) {
        return items[id];
    }

    function getAllItems() external view returns (Item[] memory) {
        Item[] memory arr = new Item[](total_items);
        for (uint256 i = 0; i < total_items; ++i) {
            Item storage tmp = items[i];
            arr[i] = tmp;
        }
        return arr;
    }

    function purchaseItem(uint256 itemid) public payable {
        purchaseItems(itemid, 1);
    }

    function purchaseItems(uint256 itemid, uint256 quantity) public payable {
        uint256 new_price;
        uint256 lpoints;
        if (loyality_points[msg.sender] < 50) {
            new_price = getItemPrice(itemid, quantity);
            lpoints = loyality_points[msg.sender];
        } else {
            (new_price, lpoints) = getDiscountedPrice(
                getItemPrice(itemid, quantity),
                loyality_points[msg.sender]
            );
        }
        require(msg.value >= new_price, "Amount not sufficient.");
        uint256 returnamount = msg.value - new_price;
        if (returnamount > 0) {
            payable(msg.sender).transfer(returnamount);
        }
        loyality_points[msg.sender] =
            lpoints +
            (items[itemid].points * quantity);
        items[itemid].quantity = items[itemid].quantity - quantity;
        user_items[msg.sender][user_items_count[msg.sender]++] = PurchaseItem(
            itemid,
            new_price,
            quantity
        );

        emit PurchasedItem(msg.sender, itemid, quantity, new_price, msg.value);
    }

    function getAllPurchasedItems(address sender)
        external
        view
        returns (PurchaseItem[] memory)
    {
        PurchaseItem[] memory arr = new PurchaseItem[](
            user_items_count[sender]
        );
        for (uint256 i = 0; i < user_items_count[sender]; ++i) {
            PurchaseItem storage tmp = user_items[sender][i];
            arr[i] = tmp;
        }
        return arr;
    }

    function transferBalance() public payable onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function transferBalanceTo(address reciever) public payable onlyOwner {
        payable(reciever).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
