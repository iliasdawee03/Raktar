use RaktarDB

INSERT INTO dbo.Users(Name, Email, Phone, PasswordHash, Role) VALUES
('Alice Smith', 'alice@example.com', '1234567890', 'hashed_pw_1', 0),
('Bob Johnson', 'bob@example.com', '1234567891', 'hashed_pw_2', 1),
('Carol White', 'carol@example.com', '1234567892', 'hashed_pw_3', 2),
('David Brown', 'david@example.com', '1234567893', 'hashed_pw_4', 3),
('Eva Green', 'eva@example.com', '1234567894', 'hashed_pw_5', 0),
('Frank Black', 'frank@example.com', '1234567895', 'hashed_pw_6', 1),
('Grace Blue', 'grace@example.com', '1234567896', 'hashed_pw_7', 2),
('Henry Red', 'henry@example.com', '1234567897', 'hashed_pw_8', 3),
('Isla Yellow', 'isla@example.com', '1234567898', 'hashed_pw_9', 0),
('Jack Pink', 'jack@example.com', '1234567899', 'hashed_pw_10', 2);

INSERT INTO dbo.Products (Name, Description, SKU, Price) VALUES
('Widget A', 'Basic widget', 'SKU001', 10.50),
('Widget B', 'Advanced widget', 'SKU002', 15.75),
('Widget C', 'Premium widget', 'SKU003', 20.00),
('Gadget A', 'Small gadget', 'SKU004', 5.25),
('Gadget B', 'Medium gadget', 'SKU005', 7.80),
('Gadget C', 'Large gadget', 'SKU006', 9.99),
('Tool A', 'Screwdriver', 'SKU007', 3.30),
('Tool B', 'Hammer', 'SKU008', 6.60),
('Tool C', 'Wrench', 'SKU009', 8.80),
('Tool D', 'Drill', 'SKU010', 45.00);

INSERT INTO dbo.Orders (CustomerId, PlacedAt, ClosedAt, Status) VALUES
(1, '2025-04-01', NULL, 'Open'),
(5, '2025-04-01', '2025-04-02', 'Closed'),
(9, '2025-03-28', NULL, 'In Transit'),
(1, '2025-03-30', NULL, 'Open'),
(5, '2025-03-25', '2025-03-27', 'Closed'),
(9, '2025-03-20', NULL, 'Open'),
(1, '2025-03-18', NULL, 'Open'),
(5, '2025-03-15', NULL, 'In Transit'),
(9, '2025-03-10', '2025-03-12', 'Closed'),
(1, '2025-03-05', NULL, 'Open');

INSERT INTO dbo.OrderItems (OrderId, ProductId, Quantity) VALUES
(1, 1, 5),
(1, 3, 2),
(2, 4, 10),
(3, 2, 7),
(4, 5, 1),
(5, 6, 3),
(6, 7, 4),
(7, 8, 8),
(8, 9, 6),
(10, 10, 2);

INSERT INTO dbo.WarehouseStorages (ProductId, LocationCode, Quantity) VALUES
(1, 'A1-01', 100),
(2, 'A1-02', 200),
(3, 'A2-01', 150),
(4, 'A2-02', 50),
(5, 'B1-01', 300),
(6, 'B1-02', 120),
(7, 'B2-01', 75),
(8, 'B2-02', 60),
(9, 'C1-01', 90),
(10, 'C1-02', 40);

INSERT INTO dbo.DeliveryForms (SupplierId, ExpectedDeliveryDate, Status) VALUES
(2, '2025-04-06', 'Filled'),
(6, '2025-04-07', 'Processed'),
(2, '2025-04-01', 'Filled'),
(6, '2025-03-31', 'Processed'),
(2, '2025-03-29', 'Filled'),
(6, '2025-03-28', 'Filled'),
(2, '2025-03-27', 'Processed'),
(6, '2025-03-26', 'Filled'),
(2, '2025-03-25', 'Processed'),
(6, '2025-03-24', 'Filled');

INSERT INTO dbo.DeliveredProducts (DeliveryFormId, ProductId, Quantity) VALUES
(1, 1, 50),
(1, 2, 30),
(2, 3, 40),
(3, 4, 20),
(4, 5, 60),
(5, 6, 35),
(6, 7, 25),
(7, 8, 45),
(8, 9, 55),
(9, 10, 65);

INSERT INTO dbo.Transports (CarrierId, OrderId, Status, StartDate, EndDate) VALUES
(3, 2, 'Delivered', '2025-04-01', '2025-04-02'),
(7, 3, 'In Transit', '2025-04-02', NULL),
(3, 5, 'Delivered', '2025-03-25', '2025-03-27'),
(7, 8, 'In Transit', '2025-03-15', NULL),
(3, 9, 'Delivered', '2025-03-10', '2025-03-12'),
(7, 4, 'Ready', NULL, NULL),
(3, 6, 'Ready', NULL, NULL),
(7, 7, 'Ready', NULL, NULL),
(3, 10, 'Ready', NULL, NULL),
(7, 1, 'Ready', NULL, NULL);

INSERT INTO dbo.Complaints (OrderId, UserId, Description, Status, CreatedAt) VALUES
(2, 1, 'Wrong item delivered', 'New', '2025-04-03'),
(3, 5, 'Late delivery', 'Processing', '2025-04-04'),
(5, 9, 'Damaged product', 'Resolved', '2025-04-01'),
(6, 1, 'Missing item', 'New', '2025-04-02'),
(8, 5, 'Packaging issue', 'Processing', '2025-03-29'),
(9, 9, 'Incorrect quantity', 'New', '2025-03-28'),
(4, 1, 'Item not as described', 'Resolved', '2025-03-30'),
(1, 5, 'Unclear invoice', 'New', '2025-03-27'),
(10, 9, 'Wrong address', 'Processing', '2025-03-26'),
(7, 1, 'Late shipment', 'Resolved', '2025-03-25');





