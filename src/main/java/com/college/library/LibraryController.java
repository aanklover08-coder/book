package com.college.library;

import com.college.library.entity.BookEntity;
import com.college.library.entity.CartItem;
import com.college.library.entity.MarketplaceBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.college.library.repository.MarketplaceBookRepository;

@RestController
@RequestMapping("/api")
public class LibraryController {

    private final LibraryService libraryService;
    private final MarketplaceBookRepository marketplaceBookRepository;

    @Autowired
    public LibraryController(LibraryService libraryService, MarketplaceBookRepository marketplaceBookRepository) {
        this.libraryService = libraryService;
        this.marketplaceBookRepository = marketplaceBookRepository;
    }

    @GetMapping("/books")
    public List<BookEntity> getBooks() {
        return libraryService.getBooks();
    }

    @PostMapping("/cart/add")
    public String addToCart(@RequestParam Long bookId, @RequestParam Long userId) {
        return libraryService.addToCart(bookId, userId);
    }

    @GetMapping("/cart")
    public List<CartItem> getCart(@RequestParam Long userId) {
        return libraryService.getCart(userId);
    }

    @PostMapping("/cart/clear")
    public String clearCart(@RequestParam Long userId) {
        libraryService.clearCart(userId);
        return "Cart cleared";
    }

    @PostMapping("/books/borrow")
    public String borrowBook(@RequestParam Long bookId) {
        return libraryService.borrowBook(bookId);
    }

    @PostMapping("/books/return")
    public String returnBook(@RequestParam Long bookId) {
        return libraryService.returnBook(bookId);
    }

    @GetMapping("/books/search")
    public List<BookEntity> searchBooks(@RequestParam String title) {
        return libraryService.searchBooks(title);
    }

    @GetMapping("/books/available")
    public List<BookEntity> getAvailableBooks() {
        return libraryService.getAvailableBooks();
    }

    // --- Marketplace Endpoints ---
    @GetMapping("/marketplace")
    public List<MarketplaceBook> getMarketplaceBooks() {
        return marketplaceBookRepository.findAll();
    }

    @PostMapping("/marketplace/add")
    public MarketplaceBook addMarketplaceBook(@RequestBody MarketplaceBook book) {
        return marketplaceBookRepository.save(book);
    }

    @DeleteMapping("/marketplace/buy/{id}")
    public String buyMarketplaceBook(@PathVariable Long id) {
        marketplaceBookRepository.deleteById(id);
        return "Book purchased and removed from marketplace.";
    }

    // --- Advanced Search & Recommendation Endpoints ---
    @GetMapping("/books/advanced-search")
    public List<BookEntity> advancedSearch(@RequestParam String query) {
        return libraryService.advancedSearch(query);
    }

    @GetMapping("/books/recommend")
    public List<BookEntity> recommendBooks() {
        return libraryService.recommendBooks();
    }

    // --- Notification Endpoints ---
    @PostMapping("/notify")
    public void addNotification(@RequestParam Long userId, @RequestParam String message) {
        libraryService.addNotification(userId, message);
    }

    @GetMapping("/notifications")
    public List<String> getNotifications(@RequestParam Long userId) {
        return libraryService.getNotifications(userId);
    }
}
