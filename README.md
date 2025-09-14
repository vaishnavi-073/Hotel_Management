# Hotel_Management
#define the menu of restaurant
menu = {
    'Pizza':150,
    'Pasta':50,
    'Burger':60,
    'Coffee':80,
    'Salad':70
}

#Greet
print("welcome to PYTHON restaurant")
print("Pizza: Rs.150\n, Pasta:Rs.50\n, Burger:Rs.60\n, Coffee:Rs.80\n, Salad:Rs.70")

order_total = 0
#80+60=140

item_1 = input("Enter the name of item you want to order =")
if item_1 in menu:
    order_total += menu[item_1] #0+50
    print(f"Your item {item_1} has been added to your order")
else:
    print(f"Ordered item {item_1} is not available")

another_order = input("Do you want to add another item? (Yes/No) ")
if another_order == 'Yes' or 'yes':
    order = int(input("How many items you want to order = "))

for i in range(order):
    item_2 = input("Enter the name of item = ")
    if item_2 in menu:
        order_total += menu[item_2]
        print(f"Item {item_2} has been added to order")
    else: 
        print(f"Ordered item {item_2} is not available!")


print(f"The total amount of items is {order_total}")
print(f"Thank You!!!")
