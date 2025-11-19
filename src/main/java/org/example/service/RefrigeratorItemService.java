package org.example.service;

import org.example.entity.RefrigeratorItem;
import org.example.entity.User;
import org.example.entity.enums.ItemStatus;
import org.example.entity.enums.StorageMethod;
import org.example.repository.RefrigeratorItemRepository;
import org.example.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RefrigeratorItemService {

    private final RefrigeratorItemRepository refrigeratorItemRepository;
    private final UserRepository userRepository;

    public RefrigeratorItemService(RefrigeratorItemRepository refrigeratorItemRepository,
                                   UserRepository userRepository) {
        this.refrigeratorItemRepository = refrigeratorItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RefrigeratorItem addItem(Long userId, String ingredientName, String quantity,
                                    LocalDate purchaseDate, LocalDate expirationDate,
                                    StorageMethod storageMethod, String category, String memo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        RefrigeratorItem item = new RefrigeratorItem();
        item.setUser(user);
        item.setIngredientName(ingredientName);
        item.setQuantity(quantity);
        item.setPurchaseDate(purchaseDate);
        item.setExpirationDate(expirationDate);
        item.setStorageMethod(storageMethod);
        item.setCategory(category);
        item.setMemo(memo);

        calculateItemStatus(item);
        return refrigeratorItemRepository.save(item);
    }

    @Transactional
    public RefrigeratorItem updateItem(Long itemId, Long userId, String ingredientName, String quantity,
                                       LocalDate purchaseDate, LocalDate expirationDate,
                                       StorageMethod storageMethod, String category, String memo) {
        RefrigeratorItem item = refrigeratorItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemId));
        ensureOwner(item, userId);

        item.setIngredientName(ingredientName);
        item.setQuantity(quantity);
        item.setPurchaseDate(purchaseDate);
        item.setExpirationDate(expirationDate);
        item.setStorageMethod(storageMethod);
        item.setCategory(category);
        item.setMemo(memo);
        calculateItemStatus(item);

        return refrigeratorItemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long itemId, Long userId) {
        RefrigeratorItem item = refrigeratorItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemId));
        ensureOwner(item, userId);
        refrigeratorItemRepository.delete(item);
    }

    @Transactional(readOnly = true)
    public List<RefrigeratorItem> getItemsByUserId(Long userId) {
        List<RefrigeratorItem> items = refrigeratorItemRepository
                .findByUserUserIdOrderByExpirationDateAsc(userId);
        items.forEach(this::calculateItemStatus);
        return items;
    }

    @Transactional(readOnly = true)
    public List<RefrigeratorItem> getExpiringItems(Long userId) {
        LocalDate today = LocalDate.now();
        return refrigeratorItemRepository.findExpiringItemsByUserId(userId, today, today.plusDays(3));
    }

    @Transactional(readOnly = true)
    public Optional<RefrigeratorItem> getItemById(Long itemId, Long userId) {
        return refrigeratorItemRepository.findById(itemId)
                .map(item -> {
                    ensureOwner(item, userId);
                    calculateItemStatus(item);
                    return item;
                });
    }

    @Transactional(readOnly = true)
    public List<RefrigeratorItem> getItemsByCategory(Long userId, String category) {
        return refrigeratorItemRepository.findByUserUserIdAndCategory(userId, category);
    }

    @Transactional(readOnly = true)
    public long getItemCount(Long userId) {
        return refrigeratorItemRepository.countByUserUserId(userId);
    }

    private void ensureOwner(RefrigeratorItem item, Long userId) {
        if (!item.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Item does not belong to user: " + userId);
        }
    }

    private void calculateItemStatus(RefrigeratorItem item) {
        if (item.getExpirationDate() == null) {
            item.setStatus(ItemStatus.FRESH);
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate exp = item.getExpirationDate();

        if (exp.isBefore(today)) {
            item.setStatus(ItemStatus.EXPIRED);
        } else if (!exp.minusDays(3).isAfter(today)) {
            item.setStatus(ItemStatus.WARNING);
        } else if (!exp.minusDays(7).isAfter(today)) {
            item.setStatus(ItemStatus.NORMAL);
        } else {
            item.setStatus(ItemStatus.FRESH);
        }
    }
}

