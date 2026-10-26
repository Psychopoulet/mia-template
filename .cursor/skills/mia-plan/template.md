# PLAN — <plugin name>

## Context
…

## Steps

### [ ] a) OpenAPI — ~Xh

1. …
2. …

### [ ] b) Back-office — ~Xh

1. …
2. …

### [ ] c) Unit tests — ~Xh

1. …
2. …

### [ ] d) Front SDK — ~Xh

1. …
2. …

### [ ] e) Front components — ~Xh

1. …
2. …

### [ ] f) README — ~Xh

1. …
2. …

### [ ] g) Review — ~Xh

1. …
2. …

Item granularity (adapt; do not copy blindly):

- OpenAPI: `1. Add put /devices (operationId: createDevice) with JSON body { name, type }; success 201; default Error.`
- Back: `1. Implement createDevice in Mediator using Descriptor types; persist via Container service X.` / `2. If emitting deviceCreated: document it in DescriptorEvents and bind-only in Server (no Server logic).`
- Tests: `1. Add test/1_createDevice.ts covering success and default-error paths.`
- Front SDK: `1. Expose createDevice on SDK using public/src/Descriptor.ts types.`
- UI: `1. Add DeviceForm.tsx (exports DeviceForm) calling SDK.createDevice.`
- README: `1. Describe who can create a device and what they see after success.`
- Review: `1. Check OpenAPI ↔ Mediator ↔ tests ↔ SDK ↔ UI ↔ README for createDevice.`
