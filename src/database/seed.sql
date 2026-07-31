INSERT OR IGNORE INTO stores (name, api_key) 
VALUES 
('Adidas Bogotá', 'api-key-bogota'), 
('Adidas Pereira', 'api_key_pereira'), 
('Adidas Medellín', 'api_key_medellin');


INSERT OR IGNORE INTO products (name)
VALUES 
('Adidas ADISTAR XLG'), 
('Adidas Stan Smith'), 
('Adidas Samba'),
('Adidas Ultraboost');


INSERT OR IGNORE INTO inventory (store_id, product_id, stock)
VALUES
(1, 1, 100), 
(1, 2, 50), 
(1, 3, 75),
(1, 4, 200), 
(2, 1, 200), 
(2, 2, 150), 
(2, 3, 125),
(2, 4, 300),
(3, 1, 300), 
(3, 2, 250),
(3, 3, 175),
(3, 4, 400);
