
import { motion } from "framer-motion";

export const AccessibilityInfo = () => {
  return (
    <div className="bg-gradient-to-br from-background via-background to-doorrush-light/5 dark:to-doorrush-dark/10 p-6 rounded-lg mb-12 shadow-sm border border-border/30 dark:border-border/10">
      <h2 className="text-2xl font-bold mb-4">Accessibility Information</h2>
      <p className="mb-4">
        DoorRush 254 is committed to ensuring digital accessibility for people with disabilities. 
        We are continually improving the user experience for everyone and applying the relevant 
        accessibility standards.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="font-semibold mb-2">Conformance Status</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            DoorRush 254 is partially conformant with WCAG 2.1 level AA. Partially conformant means 
            that some parts of the content do not fully conform to the accessibility standard.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-semibold mb-2">Compatibility</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            DoorRush 254 is designed to be compatible with the following assistive technologies:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2">
            <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
            <li>Keyboard navigation</li>
            <li>High contrast mode</li>
            <li>Text-to-speech software</li>
          </ul>
        </motion.div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Feedback</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We welcome your feedback on the accessibility of DoorRush 254. Please let us know if you 
          encounter accessibility barriers by contacting us at{' '}
          <a href="mailto:ryanemunyasa@gmail.com" className="text-doorrush-primary hover:underline">
            ryanemunyasa@gmail.com
          </a> or by 
          phone at <a href="tel:+254758301710" className="text-doorrush-primary hover:underline">+254 758 301 710</a>.
        </p>
      </div>
    </div>
  );
};
