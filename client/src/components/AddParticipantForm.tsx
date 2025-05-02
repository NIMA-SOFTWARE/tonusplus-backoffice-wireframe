import React, { useState } from 'react';
import { Participant } from '@shared/schema';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddParticipantFormProps {
  onAdd: (participant: Participant) => void;
  existingCustomers: Participant[];
}

const AddParticipantForm: React.FC<AddParticipantFormProps> = ({
  onAdd,
  existingCustomers,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCustomer = (customer: Participant) => {
    setSelectedCustomer(customer);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (selectedCustomer) {
      onAdd(selectedCustomer);
      setSelectedCustomer(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="p-4 border rounded-md bg-slate-50">
      <h3 className="text-sm font-medium mb-4">Select Existing Customer</h3>
      
      <div className="mb-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedCustomer ? selectedCustomer.name : "Select customer..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search customers..." 
                className="h-9"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {existingCustomers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.email}
                      onSelect={() => handleSelectCustomer(customer)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedCustomer && (
        <div className="mb-4 p-3 bg-white border rounded-md">
          <h4 className="text-sm font-medium mb-2">Selected Customer</h4>
          <div className="text-sm">
            <div><span className="font-medium">Name:</span> {selectedCustomer.name}</div>
            <div><span className="font-medium">Email:</span> {selectedCustomer.email}</div>
            {selectedCustomer.phone && (
              <div><span className="font-medium">Phone:</span> {selectedCustomer.phone}</div>
            )}
          </div>
        </div>
      )}
      
      <Button 
        type="button"
        className="w-full"
        onClick={handleSubmit}
        disabled={!selectedCustomer}
      >
        <User className="h-4 w-4 mr-2" />
        Add Selected Customer
      </Button>
    </div>
  );
};

export default AddParticipantForm;