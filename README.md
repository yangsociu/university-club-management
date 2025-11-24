# University Club Management API - Complete Guide

**Status**: ✅ Phase 2 Complete  
**Version**: 2.0.0  
**Last Updated**: November 23, 2025

---

## 🚀 Quick Start

```powershell
# 1. MongoDB
docker start mongodb

# 2. Run API
npm run dev

# 3. Server running at http://localhost:5000
```

---

## 📋 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Lấy thông tin user (cần token) |

### 🏢 Clubs (NEW!)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/clubs` | Xem tất cả clubs | ❌ |
| GET | `/api/clubs/:id` | Xem chi tiết club | ❌ |
| POST | `/api/clubs` | Tạo club mới | ✅ |
| PUT | `/api/clubs/:id` | Cập nhật club | ✅ |
| DELETE | `/api/clubs/:id` | Xóa club | ✅ |
| GET | `/api/clubs/user/joined` | Clubs đã join | ✅ |
| GET | `/api/clubs/user/owned` | Clubs sở hữu | ✅ |
| POST | `/api/clubs/:id/members` | Thêm thành viên | ✅ |
| DELETE | `/api/clubs/:id/members/:userId` | Xóa thành viên | ✅ |

### 📅 Events (NEW!)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | Xem tất cả events | ❌ |
| GET | `/api/events/:id` | Xem chi tiết event | ❌ |
| POST | `/api/events` | Tạo event mới | ✅ |
| PUT | `/api/events/:id` | Cập nhật event | ✅ |
| DELETE | `/api/events/:id` | Xóa event | ✅ |
| POST | `/api/events/:id/register` | Đăng ký event | ✅ |
| DELETE | `/api/events/:id/register` | Hủy đăng ký event | ✅ |
| GET | `/api/events/user/registered` | Events đã join | ✅ |

---

## 📝 Test Examples

### 1. Create Club (Postman)

```
POST http://localhost:5000/api/clubs
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Club",
  "description": "A club for technology enthusiasts and developers",
  "category": "technology",
  "location": "Room 101",
  "meetingSchedule": "Every Monday at 3 PM"
}
```

### 2. Get All Clubs

```
GET http://localhost:5000/api/clubs?category=technology&page=1&limit=10
```

### 3. Create Event

```
POST http://localhost:5000/api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tech Workshop",
  "description": "Learn Node.js and Express in depth",
  "clubId": "507f1f77bcf86cd799439011",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T12:00:00Z",
  "eventType": "workshop",
  "capacity": 50
}
```

### 4. Register for Event

```
POST http://localhost:5000/api/events/{eventId}/register
Authorization: Bearer {token}
```

---

## 🔑 Important Notes

- Tokens expire in 7 days
- Include token in header: `Authorization: Bearer {token}`
- Role-based access: student (default), president, vice-president, admin
- All errors return JSON format with success: false

---

## 🗄️ Database Models

**User**: fullName, email, password, phoneNumber, studentId, bio, profileImage, role, clubsJoined[], clubsOwned[]

**Club**: name, description, category, owner, members[], location, meetingSchedule, memberCount, isActive

**Event**: title, description, club, startDate, endDate, eventType, registeredParticipants[], capacity, status, createdBy

---

## ✅ Project Status

✅ Phase 1: Authentication  
✅ Phase 2: Club Management  
✅ Phase 3: Event Management  
⏳ Phase 4: User Profile & Advanced Features

---

## 🚀 Ready for Production!

All endpoints tested and working. Use Postman collection for testing.

**Created**: November 23, 2025
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/university-club-management
   ```

#### Cách 3: Sử dụng Docker (Nên dùng)

```powershell
# Cài đặt Docker Desktop từ https://www.docker.com/products/docker-desktop

# Chạy MongoDB trong Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Kiểm tra container đang chạy
docker ps
```

### 2. Cài đặt Project

1. Clone hoặc chuyển đến thư mục project:
   ```powershell
   cd c:\Users\HOANG GIANG\Downloads\NODE JS\university-club-management
   ```

2. Cài đặt dependencies:
   ```powershell
   npm install
   ```

3. Tạo file `.env` (hoặc cập nhật file hiện tại):
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/university-club-management
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. Chạy server:
   ```powershell
   # Development mode (auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

   Server sẽ chạy tại: `http://localhost:5000`

## 🔐 API Endpoints - Authentication

### 1. Đăng ký tài khoản

**POST** `/api/auth/register`

Request body:
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "password": "password123",
  "phoneNumber": "+84912345678",
  "studentId": "ST001"
}
```

Response (Success - 201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phoneNumber": "+84912345678",
    "studentId": "ST001",
    "role": "student",
    "isActive": true,
    "clubsJoined": [],
    "clubsOwned": [],
    "createdAt": "2025-11-21T10:00:00.000Z"
  }
}
```

### 2. Đăng nhập

**POST** `/api/auth/login`

Request body:
```json
{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

Response (Success - 200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phoneNumber": "+84912345678",
    "studentId": "ST001",
    "role": "student",
    "isActive": true,
    "clubsJoined": [],
    "clubsOwned": [],
    "createdAt": "2025-11-21T10:00:00.000Z"
  }
}
```

### 3. Lấy thông tin người dùng hiện tại

**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer {token}
```

Response (Success - 200):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phoneNumber": "+84912345678",
    "studentId": "ST001",
    "role": "student",
    "isActive": true,
    "clubsJoined": [],
    "clubsOwned": [],
    "createdAt": "2025-11-21T10:00:00.000Z"
  }
}
```

### 4. Health Check

**GET** `/api/health`

Response (Success - 200):
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-21T10:00:00.000Z"
}
```

## 📁 Cấu trúc Database

### Collections:

#### 1. **Users** - Lưu thông tin người dùng
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  studentId: String (unique, optional),
  bio: String,
  profileImage: String (URL),
  role: String ('student' | 'admin'),
  isActive: Boolean,
  clubsJoined: [ObjectId], // References to Club
  clubsOwned: [ObjectId],  // References to Club
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **Clubs** - Lưu thông tin câu lạc bộ
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String ('sports' | 'arts' | 'academic' | 'social' | 'technology' | 'culture' | 'other'),
  clubImage: String (URL),
  owner: ObjectId, // Reference to User
  members: [
    {
      user: ObjectId,
      role: String ('member' | 'vice-president' | 'president'),
      joinedAt: Date
    }
  ],
  memberCount: Number,
  location: String,
  meetingSchedule: String ('weekly' | 'bi-weekly' | 'monthly' | 'as-needed'),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **Events** - Lưu thông tin sự kiện
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  club: ObjectId, // Reference to Club
  eventImage: String (URL),
  location: String,
  startDate: Date,
  endDate: Date,
  eventType: String ('meeting' | 'workshop' | 'competition' | 'social' | 'other'),
  capacity: Number,
  registeredParticipants: [
    {
      user: ObjectId,
      registeredAt: Date,
      status: String ('registered' | 'attended' | 'cancelled')
    }
  ],
  participantCount: Number,
  status: String ('upcoming' | 'ongoing' | 'completed' | 'cancelled'),
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Kiểm tra API bằng cURL hoặc Postman

### Cài đặt Postman (Optional)
1. Tải từ: https://www.postman.com/downloads/
2. Tạo request mới

### Ví dụ kiểm tra bằng PowerShell

```powershell
# 1. Đăng ký
$registerData = @{
    fullName = "Nguyễn Văn A"
    email = "nguyenvana@example.com"
    password = "password123"
    phoneNumber = "+84912345678"
    studentId = "ST001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $registerData

# 2. Đăng nhập
$loginData = @{
    email = "nguyenvana@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $loginData

# Lấy token
$token = $loginResponse.token
Write-Host "Token: $token"

# 3. Lấy thông tin người dùng
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }
```

## 📂 Cấu trúc thư mục

```
university-club-management/
├── src/
│   ├── config/
│   │   └── database.js          # Cấu hình MongoDB
│   ├── controllers/
│   │   └── authController.js    # Logic đăng nhập/đăng ký
│   ├── middleware/
│   │   └── auth.js              # Middleware xác thực JWT
│   ├── models/
│   │   ├── User.js              # Schema người dùng
│   │   ├── Club.js              # Schema câu lạc bộ
│   │   └── Event.js             # Schema sự kiện
│   ├── routes/
│   │   └── authRoutes.js        # Routes xác thực
│   ├── utils/
│   │   └── validators.js        # Validation functions
│   └── index.js                 # Main server file
├── .env                         # Environment variables
├── .gitignore                   # Git ignore
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

## 🚦 HTTP Status Codes

- **200** - OK (Thành công)
- **201** - Created (Tạo mới thành công)
- **400** - Bad Request (Lỗi validation)
- **401** - Unauthorized (Chưa xác thực)
- **403** - Forbidden (Không có quyền)
- **404** - Not Found (Không tìm thấy)
- **500** - Internal Server Error (Lỗi server)

## 🔒 Bảo mật

- Mật khẩu được hash với bcryptjs (salt rounds: 10)
- JWT tokens hết hạn sau 7 ngày
- Helmet.js để bảo vệ headers HTTP
- CORS được cấu hình để chỉ cho phép frontend
- Sensitive data (password) không được trả về trong response

## 📝 Ghi chú

- Thay đổi `JWT_SECRET` trong `.env` cho production
- MongoDB URI trong `.env` cần được cập nhật nếu dùng MongoDB Atlas
- CORS_ORIGIN cần được cập nhật với URL frontend thực tế

## 🤝 Phát triển tiếp theo

Những features sắp tới:
- API quản lý câu lạc bộ (Create, Read, Update, Delete)
- API quản lý sự kiện
- API quản lý thành viên
- Email verification
- Forgot password functionality
- User profile management
- Club statistics & analytics

## ⚠️ Khắc phục sự cố

### MongoDB không kết nối
```powershell
# Kiểm tra MongoDB đang chạy
mongosh

# Nếu không chạy, khởi động service
# Windows: Services → MongoDB Server → Start
# hoặc dùng Docker: docker start mongodb
```

### Port 5000 đã bị sử dụng
```powershell
# Tìm process sử dụng port 5000
netstat -ano | findstr :5000

# Thay đổi PORT trong .env
PORT=5001
```

### Lỗi CORS
- Cập nhật `CORS_ORIGIN` trong `.env` với URL frontend
- Hoặc set `CORS_ORIGIN=*` để cho phép tất cả (không recommended cho production)

## 📞 Hỗ trợ

Nếu gặp bất kỳ vấn đề nào, hãy:
1. Kiểm tra console logs
2. Xác nhận MongoDB đang chạy
3. Xác nhận biến environment trong `.env`
4. Kiểm tra version Node.js: `node --version`

---

**Happy Coding! 🎉**
