package org.example.controller;

import jakarta.validation.Valid;
import org.example.dto.refrigerator.ExpiringItemResponse;
import org.example.dto.refrigerator.RefrigeratorItemRequest;
import org.example.dto.refrigerator.RefrigeratorItemResponse;
import org.example.dto.refrigerator.RefrigeratorItemSummary;
import org.example.entity.RefrigeratorItem;
import org.example.security.JwtUserDetails;
import org.example.service.RefrigeratorItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/refrigerator")
@Validated
public class RefrigeratorController {

    private final RefrigeratorItemService refrigeratorItemService;

    public RefrigeratorController(RefrigeratorItemService refrigeratorItemService) {
        this.refrigeratorItemService = refrigeratorItemService;
    }

    @GetMapping("/items")
    public ResponseEntity<List<RefrigeratorItemSummary>> getItems(@AuthenticationPrincipal JwtUserDetails currentUser) {
        List<RefrigeratorItemSummary> result = refrigeratorItemService.getItemsByUserId(currentUser.getUserId())
                .stream()
                .map(item -> new RefrigeratorItemSummary(
                        item.getItemId(),
                        item.getIngredientName(),
                        item.getQuantity(),
                        item.getExpirationDate(),
                        item.getStorageMethod(),
                        item.getStatus()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/items/expiring")
    public ResponseEntity<List<ExpiringItemResponse>> getExpiringItems(@AuthenticationPrincipal JwtUserDetails currentUser) {
        List<ExpiringItemResponse> result = refrigeratorItemService.getExpiringItems(currentUser.getUserId())
                .stream()
                .map(item -> new ExpiringItemResponse(item.getItemId(), item.getIngredientName(), item.getExpirationDate()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/items/{itemId}")
    public ResponseEntity<RefrigeratorItemResponse> getItem(@PathVariable Long itemId,
                                                            @AuthenticationPrincipal JwtUserDetails currentUser) {
        RefrigeratorItem item = refrigeratorItemService.getItemById(itemId, currentUser.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemId));
        return ResponseEntity.ok(RefrigeratorItemResponse.from(item));
    }

    @PostMapping("/items")
    public ResponseEntity<RefrigeratorItemResponse> addItem(@AuthenticationPrincipal JwtUserDetails currentUser,
                                                            @Valid @RequestBody RefrigeratorItemRequest request) {
        RefrigeratorItem item = refrigeratorItemService.addItem(
                currentUser.getUserId(),
                request.getIngredientName(),
                request.getQuantity(),
                request.getPurchaseDate(),
                request.getExpirationDate(),
                request.getStorageMethod(),
                request.getCategory(),
                request.getMemo()
        );
        return ResponseEntity.ok(RefrigeratorItemResponse.from(item));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<RefrigeratorItemResponse> updateItem(@PathVariable Long itemId,
                                                               @AuthenticationPrincipal JwtUserDetails currentUser,
                                                               @Valid @RequestBody RefrigeratorItemRequest request) {
        RefrigeratorItem item = refrigeratorItemService.updateItem(
                itemId,
                currentUser.getUserId(),
                request.getIngredientName(),
                request.getQuantity(),
                request.getPurchaseDate(),
                request.getExpirationDate(),
                request.getStorageMethod(),
                request.getCategory(),
                request.getMemo()
        );
        return ResponseEntity.ok(RefrigeratorItemResponse.from(item));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId,
                                           @AuthenticationPrincipal JwtUserDetails currentUser) {
        refrigeratorItemService.deleteItem(itemId, currentUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/items/category/{category}")
    public ResponseEntity<List<RefrigeratorItemSummary>> getItemsByCategory(@PathVariable String category,
                                                                            @AuthenticationPrincipal JwtUserDetails currentUser) {
        List<RefrigeratorItemSummary> result = refrigeratorItemService.getItemsByCategory(currentUser.getUserId(), category)
                .stream()
                .map(item -> new RefrigeratorItemSummary(
                        item.getItemId(),
                        item.getIngredientName(),
                        item.getQuantity(),
                        item.getExpirationDate(),
                        item.getStorageMethod(),
                        item.getStatus()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/items/count")
    public ResponseEntity<Long> getItemCount(@AuthenticationPrincipal JwtUserDetails currentUser) {
        return ResponseEntity.ok(refrigeratorItemService.getItemCount(currentUser.getUserId()));
    }
}
