# 🚀 Hướng Dẫn Test Phase 2 - Clubs & Events

**Cập nhật**: November 23, 2025  
**API Version**: 2.0.0 - Phase 2 Complete

---

## ✅ Kiểm tra nhanh

```powershell
# 1. Start MongoDB (nếu chưa chạy)
docker start mongodb

# 2. Start API
cd "c:\Users\HOANG GIANG\Downloads\NODE JS\university-club-management"
npm run dev

# Output:
# MongoDB Connected: localhost
# Server running on http://localhost:5000
```

✅ API sẵn sàng!

---

## 📝 Test Steps (Postman)

### Bước 1: Register & Login
```
POST /api/auth/register
Body: {
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phoneNumber": "+84912345678",
  "studentId": "ST001"
}
Response: 201 + token
```

Lấy token từ response, lưu vào variable: `{{token}}`

### Bước 2: Create Club (cần token)
```
POST /api/clubs
Authorization: Bearer {{token}}
Body: {
  "name": "Tech Club",
  "description": "A club for technology enthusiasts and developers",
  "category": "technology",
  "location": "Room 101",
  "meetingSchedule": "weekly"
}
Response: 201 Created
```

⚠️ **meetingSchedule options**: `"weekly"`, `"bi-weekly"`, `"monthly"`, `"as-needed"`

Lưu club ID từ response

### Bước 3: Get All Clubs
```
GET /api/clubs
Response: 200 OK + list of clubs
```

### Bước 4: Create Event (cần token + clubId)
```
POST /api/events
Authorization: Bearer {{token}}
Body: {
  "title": "Tech Workshop",
  "description": "Learn Node.js and Express",
  "clubId": "{clubId từ bước 2}",
  "location": "Room 201, Building B",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T12:00:00Z",
  "eventType": "workshop",
  "capacity": 50
}
Response: 201 Created
```

Lưu event ID từ response

### Bước 5: Register for Event (cần token + eventId)
```
POST /api/events/{eventId}/register
Authorization: Bearer {{token}}
Response: 200 OK
```

### Bước 6: Get My Events
```
GET /api/events/user/registered
Authorization: Bearer {{token}}
Response: 200 OK + list of events
```

---

## 📊 Expected Results

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /auth/register | 201 | User created |
| POST /auth/login | 200 | Token returned |
| GET /auth/me | 200 | User data returned |
| POST /clubs | 201 | Club created |
| GET /clubs | 200 | List clubs |
| PUT /clubs/{id} | 200 | Club updated |
| DELETE /clubs/{id} | 200 | Club deleted |
| POST /events | 201 | Event created |
| GET /events | 200 | List events |
| POST /events/{id}/register | 200 | Registered |
| GET /events/user/registered | 200 | My events |

---

## 🗄️ Kiểm Tra Data Trên MongoDB Compass

### Cách 1: Mở Compass & Kết nối

```
1. Mở MongoDB Compass (ứng dụng)
2. Connection String: mongodb://localhost:27017
3. Nhấp "Connect"
4. Bên trái: Xem "Databases"
5. Click vào: university-club-management
```

### Cách 2: Xem Users Collection

```
📁 university-club-management
   └─ users (Collection)
      └─ Documents (Dữ liệu người dùng đã register)

Thông tin hiển thị:
  • _id: ObjectId (ID duy nhất)
  • fullName: "Test User"
  • email: "test@example.com"
  • password: "$2a$10$..." (hashed)
  • phoneNumber: "+84912345678"
  • studentId: "ST001"
  • role: "student"
  • isActive: true
  • clubsJoined: [] (array rỗng lúc đầu)
  • clubsOwned: [] (array rỗng nếu chưa tạo club)
  • createdAt: "2025-11-23T..."
```

**💡 TIP**: Password được hash (mã hóa) nên không thể đọc plaintext

### Cách 3: Xem Clubs Collection

```
📁 university-club-management
   └─ clubs (Collection)
      └─ Documents (Dữ liệu câu lạc bộ)

Thông tin hiển thị:
  • _id: ObjectId (Club ID)
  • name: "Tech Club"
  • description: "A club for..."
  • category: "technology"
  • owner: ObjectId (ref đến User)
  • members: [
      {
        "user": ObjectId (member ID),
        "role": "president",  // hoặc "member", "vice-president"
        "joinedAt": "2025-11-23T..."
      },
      ...
    ]
  • memberCount: 1
  • location: "Room 101"
  • meetingSchedule: "Every Monday at 3 PM"
  • isActive: true
  • createdAt: "2025-11-23T..."
```

### Cách 4: Xem Events Collection

```
📁 university-club-management
   └─ events (Collection)
      └─ Documents (Dữ liệu sự kiện)

Thông tin hiển thị:
  • _id: ObjectId (Event ID)
  • title: "Tech Workshop"
  • description: "Learn Node.js..."
  • club: ObjectId (ref đến Club)
  • startDate: "2025-12-01T10:00:00Z"
  • endDate: "2025-12-01T12:00:00Z"
  • eventType: "workshop" (meeting, workshop, competition, social)
  • registeredParticipants: [
      {
        "user": ObjectId (participant ID),
        "status": "registered",
        "registeredAt": "2025-11-23T..."
      },
      ...
    ]
  • capacity: 50
  • status: "upcoming" (upcoming, ongoing, completed, cancelled)
  • createdBy: ObjectId (ref đến User)
  • createdAt: "2025-11-23T..."
```

### Cách 5: Filter & Tìm Kiếm Data

#### Tìm user theo email:
```
1. Click vào collection: users
2. Click nút "Filter" (bên trái)
3. Nhập: { "email": "test@example.com" }
4. Nhấp "Apply"
```

#### Tìm clubs theo category:
```
1. Click vào collection: clubs
2. Click nút "Filter"
3. Nhập: { "category": "technology" }
4. Nhấp "Apply"
```

#### Tìm events theo status:
```
1. Click vào collection: events
2. Click nút "Filter"
3. Nhập: { "status": "upcoming" }
4. Nhấp "Apply"
```

### Cách 6: Xem Chi Tiết Document

```
1. Click vào collection
2. Click vào 1 document trong list
3. Xem toàn bộ dữ liệu ở bên phải
4. Có thể edit (click icon ✏️) hoặc delete (click icon 🗑️)
```

### Cách 7: Refresh Data

```
Sau khi test API, data có thể chưa update trong Compass
Cách fix:
  • Nhấp F5 (hoặc icon ↻)
  • Hoặc Disconnect → Connect lại
  • Hoặc Đóng → Mở lại Compass
```

### ✅ Verification Checklist

Sau khi test API, kiểm tra:
- [ ] **Users collection**: Có user mới được register?
- [ ] **Clubs collection**: Có club mới được tạo?
- [ ] **Events collection**: Có event mới được tạo?
- [ ] **Club members**: Có members trong club?
- [ ] **Event participants**: Có participants đăng ký?
- [ ] **Password**: Có bị hash (không readable)?
- [ ] **Timestamps**: createdAt có đúng ngày giờ?
- [ ] **References**: Các ObjectId có liên kết đúng?

---

## 🎯 Example Workflow

```
1. Postman: Register user
   ↓
   MongoDB Compass: Xem user mới trong users collection
   ↓
2. Postman: Create club
   ↓
   MongoDB Compass: Xem club mới trong clubs collection
   ↓
3. Postman: Add member to club
   ↓
   MongoDB Compass: F5 Refresh, xem member list của club
   ↓
4. Postman: Create event
   ↓
   MongoDB Compass: Xem event mới trong events collection
   ↓
5. Postman: Register for event
   ↓
   MongoDB Compass: F5 Refresh, xem participant trong event
```

---

## 💡 MongoDB Compass Tips

| Tác vụ | Cách làm |
|--------|---------|
| Xem tất cả documents | Click vào collection → Xem danh sách |
| Tìm kiếm | Click Filter → Nhập query MongoDB |
| Sắp xếp | Click column header → Sort |
| Xem chi tiết | Click vào 1 row → Xem full data |
| Edit document | Click icon ✏️ → Sửa → Save |
| Delete document | Click icon 🗑️ → Xác nhận |
| Refresh | Nhấp F5 hoặc icon ↻ |
| Export data | Right-click collection → Export Collection |
| Import data | Right-click collection → Import Collection |

---

## 🔑 Key Features Added

✅ Club Management:
- Create/Update/Delete clubs
- Add/Remove members
- View joined clubs
- View owned clubs

✅ Event Management:
- Create/Update/Delete events
- Register/Cancel registration
- View registered events
- Filter by club/type/status

✅ Authorization:
- President can manage club
- Only event creator can edit
- Members can join events

---

## 📁 Files Changed/Created

```
✅ Created:
  - src/controllers/clubController.js
  - src/routes/clubRoutes.js
  - src/controllers/eventController.js
  - src/routes/eventRoutes.js
  - postman_collection_v2.json

✅ Updated:
  - src/index.js (added routes)
  - src/utils/validators.js (added club validation)
  - README.md (new endpoints)

✅ Deleted:
  - Old .md and .txt guide files (kept only README.md)
```

---

## 🎯 Next Phase (Phase 3+)

- [ ] User Profile Management
- [ ] Search & Advanced Filtering
- [ ] Pagination Optimization
- [ ] Email Notifications
- [ ] Image Upload
- [ ] Statistics & Analytics

---

## ✅ Status: Production Ready! 🎉

All Phase 2 features implemented and ready for testing.

Use `postman_collection_v2.json` for complete testing.
