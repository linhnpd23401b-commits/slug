# Bài tập Slug Fashion

Angular + Express + MongoDB. Danh sách Fashion được bổ sung ngay bên dưới bài Slug sản phẩm tại `/products`.

## Chức năng

- Mỗi Fashion có `IdF` là số nguyên dương, tự cấp bằng bộ đếm MongoDB và unique index.
- Slug dùng lại `SlugHelper.ts`: `ten-fashion-p12`, bỏ dấu tiếng Việt kể cả đ.
- Trang chi tiết phân tích IdF cuối slug và gọi API để lấy đúng Fashion, kể cả trùng tên.
- Danh sách và chi tiết hỗ trợ màn hình nhỏ, trạng thái tải và thông báo lỗi.

## Cấu trúc

- `src/`, `public/` và các file cấu hình ở thư mục gốc: frontend my-app.
- `my-server-mongodb/`: backend Fashion.
- `my-server-mongodb/data/fashions.json`: 12 Fashion mẫu, kèm ảnh.
- Không cần tải thư mục bài 18 để chạy bài Slug.

## Chạy bài

Cài Node.js 22.12+ nhánh 22 hoặc Node.js 24 và MongoDB đang chạy ở `mongodb://127.0.0.1:27017`.

Terminal 1, tại thư mục repository:

```powershell
cd my-server-mongodb
npm ci
node seed.js
npm start
```

Seed chỉ thêm Fashion chưa có IdF, giữ nguyên dữ liệu đã tồn tại. Server tự bổ sung IdF còn thiếu và tạo ràng buộc không trùng khi khởi động. Có thể cấu hình `MONGODB_URI` và `MONGODB_DB` bằng biến môi trường.

Terminal 2, tại thư mục repository:

```powershell
npm ci
npm start
```

Mở **http://localhost:4200/products#fashion-slug** (hoặc Chapter 4 → Bài Slug - Fashion). Chọn slug trong bảng Fashion để xem chi tiết. Frontend phải chạy qua Angular dev server để dùng proxy tới cổng 3002.

Các bài Books cũ cần server sách riêng; không cần server sách để chạy bài Slug Fashion. Dữ liệu đăng nhập không nằm trong bản nộp này.

## Kiểm tra

```powershell
npm run build
npx ng test --watch=false --include=src/app/classes/SlugHelper.spec.ts --include=src/app/fashion-detail-component/fashion-detail-component.spec.ts --include=src/app/fashion-detail-component/slug-integration.spec.ts
```

## Các file chính

- `src/app/classes/Fashion.ts`, `SlugHelper.ts`
- `src/app/fashion-component/`, `fashion-detail-component/`
- `src/app/product-list-advanced-component/`: bài Slug sản phẩm nối thêm Fashion.
- `src/app/services/fashion-apiservice.ts`
- `src/proxy.conf.json`: tách API fake-products khỏi route products.
- `my-server-mongodb/index.js`, `fashion-identity.js`, `seed.js`
