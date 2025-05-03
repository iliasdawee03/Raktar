
-- User
SET IDENTITY_INSERT Users ON; 
INSERT INTO [Users] (Id, Name, Email, Phone, PasswordHash, Role) VALUES
(1, 'Alice Kovács', 'alice@example.com', 361234567, 'hash1', 0),
(2, 'Bob Szabó', 'bob@example.com', 362345678, 'hash2', 1),
(3, 'Carol Kiss', 'carol@example.com', 363456789, 'hash3', 2),
(4, 'David Tóth', 'david@example.com', 364567890, 'hash4', 3),
(5, 'Erika Varga', 'erika@example.com', 365678901, 'hash5', 4);
SET IDENTITY_INSERT Users OFF; 

-- Product
SET IDENTITY_INSERT Products ON;
INSERT INTO Products (Id, Name, Description, BarCode, Price) VALUES
(1, 'Laptop', '14" ultrabook', '1234567890123', 249999.99),
(2, 'Egér', 'Vezeték nélküli', '2345678901234', 5999.00),
(3, 'Billentyûzet', 'Mechanikus', '3456789012345', 19999.00),
(4, 'Monitor', '27" IPS', '4567890123456', 79999.50),
(5, 'USB-C Kábel', '1m hosszú', '5678901234567', 2990.00);
SET IDENTITY_INSERT Products OFF;

-- Order
SET IDENTITY_INSERT Orders ON;
INSERT INTO [Orders] (Id, CustomerId, PlacedAt, ClosedAt, Status) VALUES
(1, 1, '2025-05-01', NULL, 'Open'),
(2, 1, '2025-04-20', '2025-04-22', 'Closed'),
(3, 2, '2025-04-25', NULL, 'In Transit'),
(4, 3, '2025-04-15', '2025-04-18', 'Closed'),
(5, 2, '2025-05-02', NULL, 'Open');
SET IDENTITY_INSERT Orders OFF;

-- OrderItem
SET IDENTITY_INSERT OrderItems ON;
INSERT INTO OrderItems(Id, OrderId, ProductId, Quantity) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 2, 3, 1),
(4, 3, 4, 2),
(5, 4, 5, 5);
SET IDENTITY_INSERT OrderItems OFF;

-- Complaint
SET IDENTITY_INSERT Complaints ON;
INSERT INTO Complaints(Id, OrderId, UserId, Description, Status, CreatedAt) VALUES
(1, 1, 1, 'Hiányzó kábel', 'New', '2025-05-02'),
(2, 2, 1, 'Sérült csomagolás', 'Resolved', '2025-04-23'),
(3, 3, 2, 'Késõi szállítás', 'Processing', '2025-04-30'),
(4, 4, 3, 'Rossz termék', 'Resolved', '2025-04-19'),
(5, 5, 2, 'Nem kaptam számlát', 'New', '2025-05-03');
SET IDENTITY_INSERT Complaints OFF;

-- WarehouseStorage
SET IDENTITY_INSERT WarehouseStorages ON;
INSERT INTO WarehouseStorages (Id, ProductId, LocationCode, Quantity) VALUES
(1, 1, 'A1-01', 10),
(2, 2, 'A1-02', 50),
(3, 3, 'B2-03', 20),
(4, 4, 'C3-04', 15),
(5, 5, 'D4-05', 100);
SET IDENTITY_INSERT WarehouseStorages OFF;

-- DeliveryForm
SET IDENTITY_INSERT DeliveryForms ON;
INSERT INTO DeliveryForms (Id, SupplierId, ExpectedDeliveryDate, CreatedAt, Status) VALUES
(1, 2, '2025-05-05', '2025-05-01', 'Filled'),
(2, 2, '2025-05-10', '2025-05-02', 'Processed'),
(3, 2, '2025-05-08', '2025-05-01', 'Filled'),
(4, 2, '2025-05-03', '2025-04-30', 'Processed'),
(5, 2, '2025-05-07', '2025-05-02', 'Filled');
SET IDENTITY_INSERT DeliveryForms OFF;

-- DeliveredProduct
SET IDENTITY_INSERT DeliveredProducts ON;
INSERT INTO DeliveredProducts (Id, DeliveryFormId, ProductId, Quantity) VALUES
(1, 1, 1, 5),
(2, 1, 2, 10),
(3, 2, 3, 7),
(4, 3, 4, 3),
(5, 4, 5, 20);
SET IDENTITY_INSERT DeliveredProducts OFF;

-- Transport
SET IDENTITY_INSERT Transports ON;
INSERT INTO Transports (Id, CarrierId, OrderId, Status, StartDate, EndDate) VALUES
(1, 3, 1, 'Ready', '2025-05-02', NULL),
(2, 3, 2, 'Delivered', '2025-04-20', '2025-04-22'),
(3, 3, 3, 'In Transit', '2025-04-30', NULL),
(4, 3, 4, 'Delivered', '2025-04-16', '2025-04-18'),
(5, 3, 5, 'Ready', '2025-05-03', NULL);
SET IDENTITY_INSERT Transports OFF;
