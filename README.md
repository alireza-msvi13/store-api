# E-commerce Platform +60 route

This is a full-featured e-commerce platform developed using Node.js, TypeScript, and Express.

If this project have been helpful to you, I’d appreciate your support by giving this repo a Star ⭐.

## Features

- **Authentication** `/auth`:
  - User registration `/register` and login `/login`.
  - Access user profile `/me` and refresh authentication tokens by entering an expired token `/refresh`.
  - Forgot password ( a code will be send to user email ) `/forget-password`
  - Reset password ( by entering code and new pass ) `/reset-password`.

- **User Management** `/user`:
  - Admin access to view all users `/`, edit user details `/edit/:id`, remove users `/remove/:id`, and ban users `/ban/:id`.
  - Users can update their own profile `/update` and view their order history `/orders`.
  - Admin can also change user roles `/role`.

- **Category Management** `/category`:
  - Admins can create `/` and manage product categories.
  - Admins can also update or remove categories by ID `/:id`.
  - All users can view the available categories `/`.

- **Product Management** `/product`:
  - Admins can create `/` and update `/:id` products, including uploading product images.
  - Products can also be removed by ID `/:id`
  - All users can view the list of products available `/` or get more info about one of them `/:id`.

- **Article Management** `/article`:
  - Admins can create `/` and update articles, including adding cover images.
  - Articles can be published, saved as drafts `/draft`, and deleted by ID `/:id`.
  - Users can view all articles or specific articles by their shortname `/:shortname`.

- **Comment Management** `/comment`:
  - Users can add comments `/`, view all comments, and provide answers `/answer/:id`.
  - Admins can remove comments `/:id`, accept `/accept/:id`, or reject `/reject/:id` comments.

- **Contact Management** `/contact`:
  - Users can send inquiries via a contact form `/`.
  - Admins can view all inquiries and delete inquiries by ID `/:id`.
  - Admins can also respond to inquiries by send email to user `/answer`.

- **Menu Management** `/menu`:
  - Admins can create and manage website menus `/`, including topbar links `/topbar`.
  - All users can view the menu `/`, `/all`.

- **Discount Management** `/off`:
  - Admins can create discount codes `/` and apply discounts to all products `/all`.
  - Users can verify discount codes `/verfiy`, while admins can remove discounts by ID `/:id`.

- **Order Management** `/order`:
  - Users can create orders `/`, and admins can change order status `/:id`.

- **Search Functionality** `/search`:
  - Users can search for products, articles, or other resources by value `/:value`.

- **Support Tickets** `/ticket`:
  - Users can create support tickets and view their own tickets `/user`.
  - Admins can manage tickets, answer them `/answer`, and view all tickets.

- **Wishlist** `/wishlist`:
  - Users can add products to their wishlist `/`, view their wishlist, or remove items from it `/:id`.

- **Admin Panel** `/info`:
  -  Admins can see last 5 products and users & count of users , orders , products




## Getting Started

### Installation


1.Clone the `repo` using the following command:
   ```sh
   git clone https://github.com/alireza-msvi13/store-api.git
   ```

2.Install node_modules
   ```sh
   npm i
   ```
3.Create .env file and set these
   ```sh
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/store-api
   NODE_ENV=production
   ACCESS_TOKEN_SECRET_KEY= set a random key like (vzdzkbjcnlaskdvscmmas)
   REFRESH_TOKEN_SECRET_KEY= set a random key like (vzdzkbjcnlaskdvscmmas)
   EMAIL=your-email
   EMAIL_PASSWORD=your-email-pass( not your real pass )
   ```


Go to your email settings, search for App Passwords, and generate an app-specific password for EMAIL_PASSWORD

4.Start project
  ```sh
  npm run dev
  ```


## Api document

you can see api doc in `postman` folder

just import `json` file in your postman and enjoy 😊💖

`baseURL` variables in request => http://localhost:3000


## Keep in touch with me

If you have any questions or find any 🪲 you can easily send me a message

<a href="https://t.me/Alireza_msvi13" target="blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" height="30" width="40" /></a>

