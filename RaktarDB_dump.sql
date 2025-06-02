

-- Product
SET IDENTITY_INSERT Products ON;
INSERT INTO Products (Id, Name, Description, BarCode, Price) VALUES
(1, 'Laptop', '14" ultrabook', '1234567890123', 249999.99),
(2, 'Egér', 'Vezeték nélküli', '2345678901234', 5999.00),
(3, 'Billentyûzet', 'Mechanikus', '3456789012345', 19999.00),
(4, 'Monitor', '27" IPS', '4567890123456', 79999.50),
(5, 'USB-C Kábel', '1m hosszú', '5678901234567', 2990.00);
SET IDENTITY_INSERT Products OFF;
