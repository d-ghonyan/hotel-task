import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface DropdownItem {
  id: string;
  label: string;
  subtitle?: string;
  avatar?: string;
}

interface DropdownProps {
  value: string | null;
  onSelect: (itemId: string | null) => void;
  items: DropdownItem[];
  placeholder?: string;
  title?: string;
}

export default function Dropdown({
  value,
  onSelect,
  items,
  placeholder = "Select item",
  title = "Select Item"
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(items);

  const selectedItem = items.find(item => item.id === value);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.label.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchText, items]);

  const handleSelect = (item: DropdownItem) => {
    onSelect(item.id);
    setIsOpen(false);
    setSearchText('');
  };

  const handleClear = () => {
    onSelect(null);
    setIsOpen(false);
    setSearchText('');
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.itemInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.label.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          {item.subtitle && (
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdownButton]}
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.buttonContent}>
          {selectedItem ? (
            <View style={styles.selectedItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {selectedItem.label.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.selectedTextContainer}>
                <Text style={styles.selectedText}>{selectedItem.label}</Text>
                {selectedItem.subtitle && (
                  <Text style={styles.selectedSubtitle}>{selectedItem.subtitle}</Text>
                )}
              </View>
            </View>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />

            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.itemList}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear Selection</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    minHeight: 48,
  },
  buttonContent: {
    flex: 1,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTextContainer: {
    flex: 1,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  itemList: {
    maxHeight: 300,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  clearButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
}); 