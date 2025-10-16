package com.college.library;

import com.college.library.entity.BookEntity;
import com.college.library.entity.CartItem;
import com.college.library.repository.BookRepository;
import com.college.library.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LibraryService {

    private final BookRepository bookRepository;
    private final CartItemRepository cartItemRepository;

    // In-memory notifications (userId -> list of notifications)
    private final ConcurrentHashMap<Long, List<String>> notifications = new ConcurrentHashMap<>();

    @Autowired
    public LibraryService(BookRepository bookRepository, CartItemRepository cartItemRepository) {
        this.bookRepository = bookRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public List<BookEntity> getBooks() {
        return bookRepository.findAll();
    }

    public String addToCart(Long bookId, Long userId) {
        BookEntity book = bookRepository.findById(bookId).orElse(null);
        if (book != null && book.isAvailable()) {
            CartItem item = new CartItem();
            item.setBookId(bookId);
            item.setUserId(userId);
            cartItemRepository.save(item);
            return "Added to cart";
        }
        return "Book not available";
    }

    public List<CartItem> getCart(Long userId) {
        return cartItemRepository.findAll().stream().filter(c -> c.getUserId().equals(userId)).toList();
    }

    public void clearCart(Long userId) {
        List<CartItem> items = cartItemRepository.findAll().stream().filter(c -> c.getUserId().equals(userId)).toList();
        cartItemRepository.deleteAll(items);
    }

    public String borrowBook(Long bookId) {
        BookEntity book = bookRepository.findById(bookId).orElse(null);
        if (book != null && book.isAvailable()) {
            book.setAvailable(false);
            bookRepository.save(book);
            return "Book borrowed";
        }
        return "Book not available for borrowing";
    }

    public String returnBook(Long bookId) {
        BookEntity book = bookRepository.findById(bookId).orElse(null);
        if (book != null && !book.isAvailable()) {
            book.setAvailable(true);
            bookRepository.save(book);
            return "Book returned";
        }
        return "Book was not borrowed";
    }

    public List<BookEntity> searchBooks(String title) {
        return bookRepository.findAll().stream()
                .filter(b -> b.getTitle().toLowerCase().contains(title.toLowerCase()))
                .toList();
    }

    public List<BookEntity> getAvailableBooks() {
        return bookRepository.findAll().stream().filter(BookEntity::isAvailable).toList();
    }

    // Advanced search: by title, author, or both (case-insensitive, partial match)
    public List<BookEntity> advancedSearch(String query) {
        String q = query.toLowerCase();
        return bookRepository.findAll().stream()
                .filter(b -> b.getTitle().toLowerCase().contains(q) || b.getAuthor().toLowerCase().contains(q))
                .toList();
    }

    // Simple recommendation: return 3 random available books
    public List<BookEntity> recommendBooks() {
        List<BookEntity> available = getAvailableBooks();
        Collections.shuffle(available, new Random());
        return available.stream().limit(3).toList();
    }

    // Add a notification for a user
    public void addNotification(Long userId, String message) {
        notifications.computeIfAbsent(userId, k -> new ArrayList<>()).add(message);
    }

    // Get and clear notifications for a user
    public List<String> getNotifications(Long userId) {
        List<String> notes = notifications.getOrDefault(userId, new ArrayList<>());
        notifications.remove(userId);
        return notes;
    }
}
