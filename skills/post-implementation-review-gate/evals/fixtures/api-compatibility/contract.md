# Frozen API compatibility contract

- Existing `getWatch` callers may continue sending `limit`, `deptName`, and `siteCode`; these legacy parameters are accepted and ignored.
- The API documentation must load under both a root deployment whose configured API base is `/api` and a reverse-proxy deployment whose configured base is `/employee-card-location-correction`.
- Unrelated migration and deployment-retry work is outside the review scope.
