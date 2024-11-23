import ContactList from './_components/contact-list';

const HomePage = () => {
  return (
    <div className="w-80 h-screen border-r fixed inset-0 z-50">
      {/* Loading */}
      {/* <div className="w-full h-[95vh] flex justify-center items-center">
        <Loader2 size={50} className="animate-spin" />
      </div> */}

      {/* contact-list */}
      <ContactList />
    </div>
  );
};

export default HomePage;
